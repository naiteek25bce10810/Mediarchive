const Doctor = require('../models/Doctor');
const Patient = require('../models/Patient');
const MedicalRecord = require('../models/MedicalRecord');
const Medication = require('../models/Medication');
const Appointment = require('../models/Appointment');
const Vital = require('../models/Vital');
const ShareToken = require('../models/ShareToken');
const AccessGrant = require('../models/AccessGrant');
const User = require('../models/User');

// Get doctor stats
exports.getStats = async (req, res, next) => {
    try {
        const doctor = await Doctor.findOne({ user: req.userId });
        if (!doctor) {
            return res.status(404).json({ message: 'Doctor profile not found.' });
        }

        const linkedPatientsCount = doctor.linkedPatients ? doctor.linkedPatients.length : 0;

        // Today's appointments
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const tomorrow = new Date(today);
        tomorrow.setDate(tomorrow.getDate() + 1);

        const todaysAppointments = await Appointment.countDocuments({
            doctor: doctor._id,
            dateTime: { $gte: today, $lt: tomorrow },
            status: 'upcoming'
        });

        // Pending reviews
        const pendingReviews = await MedicalRecord.countDocuments({
            doctor: doctor._id,
            status: 'pending'
        });

        res.json({
            totalPatients: linkedPatientsCount,
            todaysAppointments,
            pendingReviews,
            experience: doctor.experience
        });
    } catch (error) {
        next(error);
    }
};

// Search patient
exports.searchPatient = async (req, res, next) => {
    try {
        const { q } = req.query;
        if (!q) {
            return res.status(400).json({ message: 'Search query is required.' });
        }

        // Search by ABHA ID or name
        const patients = await Patient.find({
            $or: [
                { abhaId: { $regex: q, $options: 'i' } },
                { healthId: { $regex: q, $options: 'i' } }
            ]
        }).populate('user', 'name email phone');

        // Also search by user name
        const usersByName = await User.find({
            name: { $regex: q, $options: 'i' },
            role: 'patient'
        }).select('_id');

        const patientsByName = await Patient.find({
            user: { $in: usersByName.map(u => u._id) }
        }).populate('user', 'name email phone');

        // Merge and deduplicate
        const allPatients = [...patients];
        patientsByName.forEach(p => {
            if (!allPatients.find(existing => existing._id.equals(p._id))) {
                allPatients.push(p);
            }
        });

        const formattedPatients = allPatients.map(p => ({
            id: p._id,
            name: p.user?.name || 'Unknown',
            abhaId: p.abhaId,
            age: p.age,
            gender: p.gender,
            bloodGroup: p.bloodGroup,
            city: p.city
        }));

        res.json(formattedPatients);
    } catch (error) {
        next(error);
    }
};

// Verify patient access (QR token + OTP)
exports.verifyPatientAccess = async (req, res, next) => {
    try {
        const { token, otp } = req.body;
        if (!token || !otp) {
            return res.status(400).json({ message: 'Token and OTP are required.' });
        }

        const doctor = await Doctor.findOne({ user: req.userId });
        if (!doctor) {
            return res.status(404).json({ message: 'Doctor profile not found.' });
        }

        const shareToken = await ShareToken.findOne({
            token,
            otp,
            used: false,
            expiresAt: { $gt: new Date() }
        });

        if (!shareToken) {
            return res.status(400).json({ message: 'Invalid or expired token/OTP.' });
        }

        // Mark token as used
        shareToken.used = true;
        shareToken.usedBy = doctor._id;
        await shareToken.save();

        // Create access grant
        const expiresAt = new Date();
        expiresAt.setDate(expiresAt.getDate() + shareToken.duration);

        const accessGrant = await AccessGrant.create({
            patient: shareToken.patient,
            doctor: doctor._id,
            expiresAt
        });

        // Link patient to doctor if not already linked
        if (!doctor.linkedPatients.includes(shareToken.patient)) {
            doctor.linkedPatients.push(shareToken.patient);
            await doctor.save();
        }

        res.json({
            message: 'Access granted successfully.',
            accessGrant: {
                id: accessGrant._id,
                expiresAt: accessGrant.expiresAt
            }
        });
    } catch (error) {
        next(error);
    }
};

// Get patient details
exports.getPatientDetails = async (req, res, next) => {
    try {
        const doctor = await Doctor.findOne({ user: req.userId });
        if (!doctor) {
            return res.status(404).json({ message: 'Doctor profile not found.' });
        }

        const patient = await Patient.findById(req.params.patientId)
            .populate('user', 'name email phone');

        if (!patient) {
            return res.status(404).json({ message: 'Patient not found.' });
        }

        // Check if doctor has access
        const hasAccess = await AccessGrant.findOne({
            patient: patient._id,
            doctor: doctor._id,
            status: 'active',
            expiresAt: { $gt: new Date() }
        });

        const isLinked = doctor.linkedPatients.some(p => p.equals(patient._id));

        if (!hasAccess && !isLinked) {
            return res.status(403).json({ message: 'You do not have access to this patient\'s records.' });
        }

        // Get medical records
        const records = await MedicalRecord.find({ patient: patient._id })
            .sort({ date: -1 })
            .limit(20);

        // Get medications
        const medications = await Medication.find({ patient: patient._id, active: true });

        // Get vitals
        const vitals = await Vital.find({ patient: patient._id })
            .sort({ measuredAt: -1 })
            .limit(10);

        res.json({
            patient: {
                ...patient.toObject(),
                name: patient.user?.name,
                email: patient.user?.email,
                phone: patient.user?.phone
            },
            records,
            medications,
            vitals
        });
    } catch (error) {
        next(error);
    }
};

// Get linked patients
exports.getLinkedPatients = async (req, res, next) => {
    try {
        const doctor = await Doctor.findOne({ user: req.userId })
            .populate({
                path: 'linkedPatients',
                populate: { path: 'user', select: 'name email phone' }
            });

        if (!doctor) {
            return res.status(404).json({ message: 'Doctor profile not found.' });
        }

        const patients = (doctor.linkedPatients || []).map(patient => ({
            id: patient._id,
            name: patient.user?.name || 'Unknown',
            abhaId: patient.abhaId,
            age: patient.age,
            gender: patient.gender,
            bloodGroup: patient.bloodGroup,
            lastVisit: patient.updatedAt,
            condition: patient.chronicConditions?.[0] || 'General',
            status: 'Active',
            country: 'India'
        }));

        res.json(patients);
    } catch (error) {
        next(error);
    }
};

// Add medical entry for a patient
exports.addMedicalEntry = async (req, res, next) => {
    try {
        const doctor = await Doctor.findOne({ user: req.userId });
        if (!doctor) {
            return res.status(404).json({ message: 'Doctor profile not found.' });
        }

        const patient = await Patient.findById(req.params.patientId);
        if (!patient) {
            return res.status(404).json({ message: 'Patient not found.' });
        }

        const { type, date, diagnosis, prescription, notes } = req.body;

        const files = req.files ? req.files.map(file => ({
            filename: file.filename,
            originalName: file.originalname,
            path: file.path,
            mimetype: file.mimetype,
            size: file.size
        })) : [];

        const doctorUser = await User.findById(req.userId);

        const record = await MedicalRecord.create({
            patient: patient._id,
            doctor: doctor._id,
            doctorName: doctorUser.name,
            doctorSpecialization: doctor.specialization,
            type: type || 'consultation',
            date: date || new Date(),
            diagnosis,
            prescription,
            notes,
            files,
            addedBy: 'doctor',
            status: 'pending' // Needs patient approval
        });

        res.status(201).json({ message: 'Medical entry added. Awaiting patient approval.', record });
    } catch (error) {
        next(error);
    }
};

// Update medical entry
exports.updateMedicalEntry = async (req, res, next) => {
    try {
        const doctor = await Doctor.findOne({ user: req.userId });
        if (!doctor) {
            return res.status(404).json({ message: 'Doctor profile not found.' });
        }

        const record = await MedicalRecord.findOneAndUpdate(
            { _id: req.params.entryId, doctor: doctor._id },
            req.body,
            { new: true, runValidators: true }
        );

        if (!record) {
            return res.status(404).json({ message: 'Medical entry not found.' });
        }

        res.json({ message: 'Entry updated successfully.', record });
    } catch (error) {
        next(error);
    }
};

// Request patient access
exports.requestPatientAccess = async (req, res, next) => {
    try {
        const doctor = await Doctor.findOne({ user: req.userId });
        if (!doctor) {
            return res.status(404).json({ message: 'Doctor profile not found.' });
        }

        const patient = await Patient.findById(req.params.patientId);
        if (!patient) {
            return res.status(404).json({ message: 'Patient not found.' });
        }

        const { reason } = req.body;

        // Check if access already exists
        const existingAccess = await AccessGrant.findOne({
            patient: patient._id,
            doctor: doctor._id,
            status: 'active',
            expiresAt: { $gt: new Date() }
        });

        if (existingAccess) {
            return res.json({ message: 'You already have active access to this patient.' });
        }

        // In a real app, this would send notification to patient
        // For now, auto-grant access for 7 days
        const expiresAt = new Date();
        expiresAt.setDate(expiresAt.getDate() + 7);

        const accessGrant = await AccessGrant.create({
            patient: patient._id,
            doctor: doctor._id,
            reason,
            expiresAt
        });

        // Link patient
        if (!doctor.linkedPatients.includes(patient._id)) {
            doctor.linkedPatients.push(patient._id);
            await doctor.save();
        }

        res.status(201).json({ message: 'Access requested and granted.', accessGrant });
    } catch (error) {
        next(error);
    }
};

// Get patient vitals
exports.getPatientVitals = async (req, res, next) => {
    try {
        const doctor = await Doctor.findOne({ user: req.userId });
        if (!doctor) {
            return res.status(404).json({ message: 'Doctor profile not found.' });
        }

        const { period = '6M' } = req.query;

        // Calculate date range from period
        const now = new Date();
        let startDate = new Date();
        switch (period) {
            case '1M': startDate.setMonth(now.getMonth() - 1); break;
            case '3M': startDate.setMonth(now.getMonth() - 3); break;
            case '6M': startDate.setMonth(now.getMonth() - 6); break;
            case '1Y': startDate.setFullYear(now.getFullYear() - 1); break;
            default: startDate.setMonth(now.getMonth() - 6);
        }

        const vitals = await Vital.find({
            patient: req.params.patientId,
            measuredAt: { $gte: startDate }
        }).sort({ measuredAt: 1 });

        res.json(vitals);
    } catch (error) {
        next(error);
    }
};

// Get patient medications
exports.getPatientMedications = async (req, res, next) => {
    try {
        const medications = await Medication.find({
            patient: req.params.patientId,
            active: true
        });

        res.json(medications);
    } catch (error) {
        next(error);
    }
};

// Add prescription
exports.addPrescription = async (req, res, next) => {
    try {
        const doctor = await Doctor.findOne({ user: req.userId });
        if (!doctor) {
            return res.status(404).json({ message: 'Doctor profile not found.' });
        }

        const patient = await Patient.findById(req.params.patientId);
        if (!patient) {
            return res.status(404).json({ message: 'Patient not found.' });
        }

        const doctorUser = await User.findById(req.userId);
        const { medications } = req.body;

        if (!medications || !Array.isArray(medications) || medications.length === 0) {
            return res.status(400).json({ message: 'Medications array is required.' });
        }

        const createdMeds = await Promise.all(
            medications.map(med =>
                Medication.create({
                    patient: patient._id,
                    name: med.name,
                    dosage: med.dosage,
                    frequency: med.frequency,
                    time: med.time,
                    prescribedBy: doctor._id,
                    prescribedByName: doctorUser.name,
                    active: true
                })
            )
        );

        res.status(201).json({ message: 'Prescription added successfully.', medications: createdMeds });
    } catch (error) {
        next(error);
    }
};
