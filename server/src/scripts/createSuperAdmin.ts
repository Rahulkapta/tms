import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { Role } from '../models/role.model';
import { User } from '../models/user.model';
import { UserDetails } from '../models/userDetails.model';
import { Permissions } from '../utils/common.utils';

// Load env variables
dotenv.config();

const mongoUri = process.env.MONGO_URI || 'mongodb+srv://rr361680:9NPOTUQcW5Ulil0c@test-tms.xtrm5xy.mongodb.net/?retryWrites=true&w=majority&appName=test-TMS';

async function createSuperAdmin() {
    await mongoose.connect(mongoUri);

    // Check if Super Admin already exists
    const superAdminRole = await Role.findOne({ name: 'SUPER ADMIN' });
    let roleId = superAdminRole?._id;
    if (!superAdminRole) {
        const role = await Role.create({ name: 'SUPER ADMIN', permissions: [Permissions.CREATE, Permissions.READ, Permissions.DELETE, Permissions.UPDATE] });
        roleId = role._id;
    }

    const existingSuperAdmin = await User.findOne({ roleId });
    if (existingSuperAdmin) {
        console.log('Super Admin already exists.');
        process.exit(0);
    }

    // Prompt for email and name (for demo, hardcoded)
    const email = 'superadmin@example.com';
    const otp = '123456'; // For demo, should be random in prod

    // Create user details first (without userId)
    const userDetails = await UserDetails.create({
        name: { first: 'Super', last: 'Admin' },
        mobileNumber: '9999999999',
        photoUrl: '',
    });

    // Create user with detailsId
    const user = await User.create({
        email,
        otpPin: otp,
        roleId,
        detailsId: userDetails._id,
        isActive: true,
        createdBy: null,
        updatedBy: null,
    });

    // Update userId in userDetails
    userDetails.userId = user._id as any;
    await userDetails.save();

    console.log('Super Admin created:', email, 'OTP:', otp);
    process.exit(0);
}

createSuperAdmin(); 