const User = require('../models/User');
const Patient = require('../models/Patient');
const Doctor = require('../models/Doctor');
const crypto = require('crypto');

// Login
exports.login = async (req, res, next) => {
    try {
        const { email, password, role } = req.body;

        if (!email || !password || !role) {
            return res.status(400).json({ message: 'Email, password, and role are required.' });
        }

        const user = await User.findOne({ email, role });
        if (!user) {
            return res.status(401).json({ message: 'Invalid credentials.' });
        }

        const isMatch = await user.comparePassword(password);
        if (!isMatch) {
            return res.status(401).json({ message: 'Invalid credentials.' });
        }

        const token = user.generateAuthToken();
        const refreshToken = user.generateRefreshToken();

        // Get profile data based on role
        let profile = null;
        if (role === 'patient') {
            profile = await Patient.findOne({ user: user._id });
        } else if (role === 'doctor') {
            profile = await Doctor.findOne({ user: user._id });
        }

        res.json({
            token,
            refreshToken,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                phone: user.phone,
                profile
            }
        });
    } catch (error) {
        next(error);
    }
};

// Register Patient
exports.registerPatient = async (req, res, next) => {
    try {
        const { name, email, password, phone, abhaId, aadhaar, age, gender, bloodGroup, height, weight, city, state } = req.body;

        // Check if user exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'Email already registered.' });
        }

        // Create user
        const user = await User.create({
            name,
            email,
            password,
            role: 'patient',
            phone
        });

        // Generate health ID
        const healthId = 'HLTH' + String(await Patient.countDocuments() + 1).padStart(3, '0');

        // Create patient profile
        const patient = await Patient.create({
            user: user._id,
            abhaId,
            healthId,
            aadhaar,
            age,
            gender,
            bloodGroup,
            height,
            weight,
            city,
            state
        });

        const token = user.generateAuthToken();

        res.status(201).json({
            message: 'Patient registered successfully.',
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                profile: patient
            }
        });
    } catch (error) {
        next(error);
    }
};

// Register Doctor
exports.registerDoctor = async (req, res, next) => {
    try {
        const { name, email, password, phone, hprId, specialization, hospital, experience, qualifications } = req.body;

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'Email already registered.' });
        }

        const user = await User.create({
            name,
            email,
            password,
            role: 'doctor',
            phone
        });

        const doctor = await Doctor.create({
            user: user._id,
            hprId,
            specialization,
            hospital,
            experience,
            qualifications
        });

        const token = user.generateAuthToken();

        res.status(201).json({
            message: 'Doctor registered successfully.',
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                profile: doctor
            }
        });
    } catch (error) {
        next(error);
    }
};

// Refresh Token
exports.refreshToken = async (req, res, next) => {
    try {
        // User is already authenticated via auth middleware
        const token = req.user.generateAuthToken();
        res.json({ token });
    } catch (error) {
        next(error);
    }
};

// Change Password
exports.changePassword = async (req, res, next) => {
    try {
        const { currentPassword, newPassword } = req.body;

        if (!currentPassword || !newPassword) {
            return res.status(400).json({ message: 'Current and new password are required.' });
        }

        const user = await User.findById(req.userId);
        const isMatch = await user.comparePassword(currentPassword);
        if (!isMatch) {
            return res.status(400).json({ message: 'Current password is incorrect.' });
        }

        user.password = newPassword;
        await user.save();

        res.json({ message: 'Password changed successfully.' });
    } catch (error) {
        next(error);
    }
};

// Forgot Password (mock - just generates token)
exports.forgotPassword = async (req, res, next) => {
    try {
        const { email } = req.body;

        const user = await User.findOne({ email });
        if (!user) {
            // Don't reveal if user exists
            return res.json({ message: 'If an account exists with this email, a reset link has been sent.' });
        }

        // Generate reset token
        const resetToken = crypto.randomBytes(32).toString('hex');
        user.resetPasswordToken = crypto.createHash('sha256').update(resetToken).digest('hex');
        user.resetPasswordExpires = Date.now() + 3600000; // 1 hour
        await user.save();

        // In production, send email with reset link
        res.json({
            message: 'If an account exists with this email, a reset link has been sent.',
            // Include token in dev mode for testing
            ...(process.env.NODE_ENV === 'development' && { resetToken })
        });
    } catch (error) {
        next(error);
    }
};

// Reset Password
exports.resetPassword = async (req, res, next) => {
    try {
        const { token, newPassword } = req.body;

        if (!token || !newPassword) {
            return res.status(400).json({ message: 'Token and new password are required.' });
        }

        const hashedToken = crypto.createHash('sha256').update(token).digest('hex');
        const user = await User.findOne({
            resetPasswordToken: hashedToken,
            resetPasswordExpires: { $gt: Date.now() }
        });

        if (!user) {
            return res.status(400).json({ message: 'Invalid or expired reset token.' });
        }

        user.password = newPassword;
        user.resetPasswordToken = undefined;
        user.resetPasswordExpires = undefined;
        await user.save();

        res.json({ message: 'Password reset successfully.' });
    } catch (error) {
        next(error);
    }
};

// Send Aadhaar OTP (mock)
exports.sendAadhaarOTP = async (req, res, next) => {
    try {
        const { aadhaarNumber } = req.body;

        if (!aadhaarNumber) {
            return res.status(400).json({ message: 'Aadhaar number is required.' });
        }

        // Mock OTP sending
        res.json({
            message: 'OTP sent to registered mobile number.',
            // In dev mode, return the mock OTP
            ...(process.env.NODE_ENV === 'development' && { otp: '123456' })
        });
    } catch (error) {
        next(error);
    }
};

// Verify Aadhaar (mock)
exports.verifyAadhaar = async (req, res, next) => {
    try {
        const { aadhaarNumber, otp } = req.body;

        if (!aadhaarNumber || !otp) {
            return res.status(400).json({ message: 'Aadhaar number and OTP are required.' });
        }

        // Mock verification - accept any 6-digit OTP in dev
        if (otp.length === 6) {
            res.json({
                verified: true,
                message: 'Aadhaar verified successfully.',
                abhaId: `${aadhaarNumber.substring(0, 2)}-${Date.now().toString().substring(5)}-${Math.floor(1000 + Math.random() * 9000)}`
            });
        } else {
            res.status(400).json({ verified: false, message: 'Invalid OTP.' });
        }
    } catch (error) {
        next(error);
    }
};
