// backend/src/models/Achievement.js

import mongoose from 'mongoose';

const AchievementSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true,
        unique: true
    },
    description: {
        type: String,
        required: true,
        trim: true,
    },
    icon: {
        type: String, 
        default: 'trophy'
    },
    criteria: {
        type: Object,
        required: true,
    },
    isActive: {
        type: Boolean,
        default: true
    }
}, {
    timestamps: true
});

const Achievement = mongoose.model('Achievement', AchievementSchema);
export default Achievement;