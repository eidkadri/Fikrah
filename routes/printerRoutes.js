const express = require('express');
const ServicePrinter = require('../models/servec-printer');
const Cart = require('../models/cart');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const pdfParse = require('pdf-parse');
const mammoth = require('mammoth');
const xlsx = require('xlsx');
const PptxGenJS = require('pptxgenjs');
const router = express.Router();

// إعداد multer لتحميل الملفات
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'documents/');
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + '-' + file.originalname);
    }
});
const upload = multer({ storage: storage }).array('files', 12); // تم التغيير ليقبل حقول الملفات

// تحديد عدد الصفحات
const getPageCount = async (filePath, mimeType) => {
    switch (mimeType) {
        case 'application/pdf':
            return await getPdfPages(filePath);
        case 'application/vnd.openxmlformats-officedocument.wordprocessingml.document':
            return await getDocxPages(filePath);
        case 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet':
            return getExcelSheets(filePath);
        case 'application/vnd.openxmlformats-officedocument.presentationml.presentation':
            return await getPptxSlides(filePath);
        default:
            return 1; // اعتبر أن الصور عبارة عن صفحة واحدة
    }
};

// معالجة ملفات الـPDF
const getPdfPages = async (filePath) => {
    const dataBuffer = fs.readFileSync(filePath);
    const data = await pdfParse(dataBuffer);
    return data.numpages;
};

// معالجة ملفات الـDOCX
const getDocxPages = async (filePath) => {
    const dataBuffer = fs.readFileSync(filePath);
    const result = await mammoth.extractRawText({ buffer: dataBuffer });
    const wordsPerPage = 300; // تقديري
    const numPages = Math.ceil(result.value.split(/\s+/).length / wordsPerPage);
    return numPages;
};

// معالجة ملفات الـXLSX
const getExcelSheets = (filePath) => {
    const workbook = xlsx.readFile(filePath);
    return workbook.SheetNames.length;
};

// معالجة ملفات الـPPTX
const getPptxSlides = async (filePath) => {
    const pptx = new PptxGenJS();
    const presentation = await pptx.load(filePath);
    return presentation.slideCount;
};

// إنشاء خدمة طباعة جديدة
router.post('/service-printer/create', upload, async (req, res) => {
    try {
        const fileProperties = JSON.parse(req.body.properties); // تأكد من أن الحقول موجودة وتفسير الخصائص
        const files = await Promise.all(req.files.map(async (file, index) => {
            const pageCount = await getPageCount(file.path, file.mimetype);
            return {
                fileName: path.join('/documents', file.filename),
                pageCount,
                ...fileProperties[index]
            };
        }));
        
        const newService = new ServicePrinter({
            files,
            notes: req.body.notes
        });
        await newService.save();
        res.status(201).json(newService);
    } catch (error) {
        res.status(500).json({ message: 'Failed to create service', error });
    }
});

// جلب جميع خدمات الطباعة
router.get('/service-printer', async (req, res) => {
    try {
        const services = await ServicePrinter.find();
        res.status(200).json(services);
    } catch (error) {
        res.status(500).json({ message: 'Failed to fetch services', error });
    }
});

// تحديث خدمة طباعة بناءً على ID
router.put('/service-printer/:id', async (req, res) => {
    try {
        const updatedService = await ServicePrinter.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.status(200).json(updatedService);
    } catch (error) {
        res.status(500).json({ message: 'Failed to update service', error });
    }
});

// حذف خدمة طباعة بناءً على ID
router.delete('/service-printer/:id', async (req, res) => {
    try {
        await ServicePrinter.findByIdAndDelete(req.params.id);
        res.status(204).json({ message: 'Service deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Failed to delete service', error });
    }
});

module.exports = router;
