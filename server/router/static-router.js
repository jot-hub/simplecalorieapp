const express = require('express');
const router = express.Router();
const path = require('path');

const staticExt = [
    '*.js',
    '*.ico',
    '*.css',
    '*.png',
    '*.jpg',
    '*.woof2',
    '*.woof',
    '*.ttf',
    '*.svg'
];

router.get(staticExt.join('|'), (req,res,next) => {
    res.set({
        "Cache-Control": "private, max-age=3600",
        "Expires": new Date(Date.now() + 3600000).toUTCString()
    });
    const staticPath = "../../simple-calorie-app/dist/simple-calorie-app";
    res.sendFile(req.url, {root: path.join(__dirname, staticPath)}, err => {
        if(err) return next(err);
    });
});

module.exports = router;