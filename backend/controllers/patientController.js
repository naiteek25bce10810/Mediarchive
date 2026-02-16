const Patient = require('../models/Patient');
const MedicalRecord = require('../models/MedicalRecord');
const Medication = require('../models/Medication');
const Appointment = require('../models/Appointment');
const Vital = require('../models/Vital');
const ShareToken = require('../models/ShareToken');
const AccessGrant = require('../models/AccessGrant');
const crypto = require('crypto');
const path = require('path');
const fs = require('fs');

// Get patient profile
exports.getProfile = async (req, res, next) => {
    try {
        const patient = await Patient.findOne({ user: req.userId }).populate('user', 'name email phone');
        if (!patient) {
            return res.status(404).json({ message: 'Patient profile not found.' });
        }

        res.json({
            ...patient.toObject(),
            name: patient.user?.name,
            email: patient.user?.email,
            phone: patient.user?.phone
        });
    } catch (error) {
        next(error);
    }
};

// Update patient profile
exports.updateProfile = async (req, res, next) => {
    try {
        const allowedUpdates = ['age', 'gender', 'bloodGroup', 'height', 'weight', 'city', 'state', 'allergies', 'chronicConditions', 'emergencyContact'];
        const updates = {};

        Object.keys(req.body).forEach(key => {
            if (allowedUpdates.includes(key)) {
                updates[key] = req.body[key];
            }
        });

        const patient = await Patient.findOneAndUpdate(
            { user: req.userId },
            updates,
            { new: true, runValidators: true }
        ).populate('user', 'name email phone');

        if (!patient) {
            return res.status(404).json({ message: 'Patient profile not found.' });
        }

        res.json({ message: 'Profile updated successfully.', patient });
    } catch (error) {
        next(error);
    }
};

// Get patient stats
exports.getStats = async (req, res, next) => {
    try {
        const patient = await Patient.findOne({ user: req.userId });
        if (!patient) {
            return res.status(404).json({ message: 'Patient profile not found.' });
        }

        // Get next appointment
        const nextAppointment = await Appointment.findOne({
            patient: patient._id,
            status: 'upcoming',
            dateTime: { $gte: new Date() }
        }).sort({ dateTime: 1 });

        // Get today's medications
        const medications = await Medication.find({
            patient: patient._id,
            active: true
        });

        // Get latest vitals
        const latestBP = await Vital.findOne({ patient: patient._id, type: 'blood_pressure' }).sort({ measuredAt: -1 });
        const latestSugar = await Vital.findOne({ patient: patient._id, type: 'blood_sugar' }).sort({ measuredAt: -1 });
        const latestHR = await Vital.findOne({ patient: patient._id, type: 'heart_rate' }).sort({ measuredAt: -1 });

        // Get care team count (unique doctors from access grants)
        const careTeamCount = await AccessGrant.distinct('doctor', {
            patient: patient._id,
            status: 'active'
        });

        // Get total records
        const totalRecords = await MedicalRecord.countDocuments({ patient: patient._id });

        res.json({
            nextAppointment,
            medicationsDue: medications.filter(m => !m.taken).length,
            medications,
            vitals: {
                bloodPressure: latestBP,
                bloodSugar: latestSugar,
                heartRate: latestHR
            },
            careTeamCount: careTeamCount.length,
            totalRecords
        });
    } catch (error) {
        next(error);
    }
};

// Get medical history (paginated)
exports.getMedicalHistory = async (req, res, next) => {
    try {
        const patient = await Patient.findOne({ user: req.userId });
        if (!patient) {
            return res.status(404).json({ message: 'Patient profile not found.' });
        }

        const { page = 1, limit = 10, type } = req.query;
        const query = { patient: patient._id };

        if (type) {
            query.type = type;
        }

        const records = await MedicalRecord.find(query)
            .sort({ date: -1 })
            .skip((page - 1) * limit)
            .limit(parseInt(limit))
            .populate('doctor', 'specialization hospital');

        const total = await MedicalRecord.countDocuments(query);

        res.json({
            records,
            pagination: {
                page: parseInt(page),
                limit: parseInt(limit),
                total,
                pages: Math.ceil(total / limit)
            }
        });
    } catch (error) {
        next(error);
    }
};

// Upload medical record
exports.uploadRecord = async (req, res, next) => {
    try {
        const patient = await Patient.findOne({ user: req.userId });
        if (!patient) {
            return res.status(404).json({ message: 'Patient profile not found.' });
        }

        const { recordType, date, doctorName, hospitalName, diagnosis, notes } = req.body;

        const files = req.files ? req.files.map(file => ({
            filename: file.filename,
            originalName: file.originalname,
            path: file.path,
            mimetype: file.mimetype,
            size: file.size
        })) : [];

        const record = await MedicalRecord.create({
            patient: patient._id,
            type: recordType || 'other',
            date: date || new Date(),
            doctorName,
            hospitalName,
            diagnosis,
            notes,
            files,
            addedBy: 'patient',
            status: 'completed'
        });

        res.status(201).json({ message: 'Record uploaded successfully.', record });
    } catch (error) {
        next(error);
    }
};

// Download record file
exports.downloadRecord = async (req, res, next) => {
    try {
        const patient = await Patient.findOne({ user: req.userId });
        if (!patient) {
            return res.status(404).json({ message: 'Patient profile not found.' });
        }

        const record = await MedicalRecord.findOne({
            _id: req.params.recordId,
            patient: patient._id
        });

        if (!record) {
            return res.status(404).json({ message: 'Record not found.' });
        }

        if (!record.files || record.files.length === 0) {
            return res.status(404).json({ message: 'No files attached to this record.' });
        }

        // Send the first file
        const file = record.files[0];
        const filePath = path.resolve(file.path);

        if (!fs.existsSync(filePath)) {
            return res.status(404).json({ message: 'File not found on server.' });
        }

        res.download(filePath, file.originalName);
    } catch (error) {
        next(error);
    }
};

// Generate share token
exports.generateShareToken = async (req, res, next) => {
    try {
        const patient = await Patient.findOne({ user: req.userId });
        if (!patient) {
            return res.status(404).json({ message: 'Patient profile not found.' });
        }

        const { duration = 3 } = req.body; // days

        const token = 'MED-' + crypto.randomBytes(8).toString('hex').toUpperCase();
        const otp = Math.floor(100000 + Math.random() * 900000).toString();

        const expiresAt = new Date();
        expiresAt.setDate(expiresAt.getDate() + parseInt(duration));

        const shareToken = await ShareToken.create({
            patient: patient._id,
            token,
            otp,
            duration: parseInt(duration),
            expiresAt
        });

        res.status(201).json({
            token: shareToken.token,
            otp: shareToken.otp,
            expiresAt: shareToken.expiresAt,
            duration: shareToken.duration
        });
    } catch (error) {
        next(error);
    }
};

// Get active access list
exports.getActiveAccess = async (req, res, next) => {
    try {
        const patient = await Patient.findOne({ user: req.userId });
        if (!patient) {
            return res.status(404).json({ message: 'Patient profile not found.' });
        }

        // Update any expired grants
        await AccessGrant.updateMany(
            { patient: patient._id, status: 'active', expiresAt: { $lt: new Date() } },
            { status: 'expired' }
        );

        const accessGrants = await AccessGrant.find({
            patient: patient._id,
            status: 'active'
        }).populate({
            path: 'doctor',
            populate: { path: 'user', select: 'name email phone' }
        });

        const formattedGrants = accessGrants.map(grant => ({
            id: grant._id,
            doctorName: grant.doctor?.user?.name || 'Unknown Doctor',
            specialization: grant.doctor?.specialization || '',
            hospital: grant.doctor?.hospital || '',
            grantedAt: grant.grantedAt,
            expiresAt: grant.expiresAt
        }));

        res.json(formattedGrants);
    } catch (error) {
        next(error);
    }
};

// Revoke access
exports.revokeAccess = async (req, res, next) => {
    try {
        const patient = await Patient.findOne({ user: req.userId });
        if (!patient) {
            return res.status(404).json({ message: 'Patient profile not found.' });
        }

        const grant = await AccessGrant.findOneAndUpdate(
            { _id: req.params.accessId, patient: patient._id, status: 'active' },
            { status: 'revoked' },
            { new: true }
        );

        if (!grant) {
            return res.status(404).json({ message: 'Access grant not found.' });
        }

        res.json({ message: 'Access revoked successfully.' });
    } catch (error) {
        next(error);
    }
};

// Get pending approvals
exports.getPendingApprovals = async (req, res, next) => {
    try {
        const patient = await Patient.findOne({ user: req.userId });
        if (!patient) {
            return res.status(404).json({ message: 'Patient profile not found.' });
        }

        const pendingRecords = await MedicalRecord.find({
            patient: patient._id,
            status: 'pending',
            addedBy: 'doctor'
        }).populate('doctor', 'specialization hospital');

        res.json(pendingRecords);
    } catch (error) {
        next(error);
    }
};

// Approve medical entry
exports.approveEntry = async (req, res, next) => {
    try {
        const patient = await Patient.findOne({ user: req.userId });
        if (!patient) {
            return res.status(404).json({ message: 'Patient profile not found.' });
        }

        const record = await MedicalRecord.findOneAndUpdate(
            { _id: req.params.entryId, patient: patient._id, status: 'pending' },
            { status: 'approved' },
            { new: true }
        );

        if (!record) {
            return res.status(404).json({ message: 'Pending entry not found.' });
        }

        res.json({ message: 'Entry approved successfully.', record });
    } catch (error) {
        next(error);
    }
};
