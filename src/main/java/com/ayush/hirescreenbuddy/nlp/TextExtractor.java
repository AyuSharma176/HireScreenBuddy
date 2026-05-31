package com.ayush.hirescreenbuddy.nlp;

import org.apache.pdfbox.Loader;
import org.apache.pdfbox.pdmodel.PDDocument;
import org.apache.pdfbox.text.PDFTextStripper;
import org.apache.tika.Tika;
import org.apache.tika.exception.TikaException;
import org.springframework.stereotype.Component;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.io.InputStream;

/**
 * Text Extractor - Extracts text content from resume files.
 * Supports PDF and DOCX formats for resume parsing.
 */
@Component
public class TextExtractor {

    private final Tika tika = new Tika();

    /**
     * Extract text from a resume file.
     * Automatically detects file type and uses appropriate extraction method.
     *
     * @param file Resume file (PDF or DOCX)
     * @return Extracted and cleaned text content
     * @throws IOException If file operations fail
     * @throws TikaException If text extraction fails
     */
    public String extractText(MultipartFile file) throws IOException, TikaException {
        String filename = file.getOriginalFilename();

        if (filename == null) {
            throw new IOException("File name is null");
        }

        if (filename.endsWith(".pdf")) {
            return extractFromPDF(file);
        } else if (filename.endsWith(".docx") || filename.endsWith(".doc")) {
            return extractFromDOCX(file);
        } else {
            throw new IOException("Unsupported file type. Only PDF and DOCX allowed.");
        }
    }

    /**
     * Extract text from PDF file using PDFBox.
     * PDFBox 3.x uses Loader.loadPDF() instead of PDDocument.load()
     *
     * @param file PDF resume file
     * @return Extracted text content
     * @throws IOException If PDF operations fail
     */
    private String extractFromPDF(MultipartFile file) throws IOException {
        byte[] bytes = file.getBytes();
        try (PDDocument document = Loader.loadPDF(bytes)) {
            PDFTextStripper stripper = new PDFTextStripper();
            String text = stripper.getText(document);
            return cleanText(text);
        }
    }

    /**
     * Extract text from DOCX file using Apache Tika.
     *
     * @param file DOCX resume file
     * @return Extracted text content
     * @throws IOException If file operations fail
     * @throws TikaException If text extraction fails
     */
    private String extractFromDOCX(MultipartFile file) throws IOException, TikaException {
        try (InputStream inputStream = file.getInputStream()) {
            String text = tika.parseToString(inputStream);
            return cleanText(text);
        }
    }

    /**
     * Clean extracted text by removing extra whitespace and normalizing line breaks.
     *
     * @param text Raw extracted text
     * @return Cleaned text
     */
    private String cleanText(String text) {
        if (text == null) return "";
        return text
                .replaceAll("\\s+", " ")    // Replace multiple spaces with single space
                .replaceAll("[\r\n]+", "\n") // Normalize line breaks
                .trim();
    }
}