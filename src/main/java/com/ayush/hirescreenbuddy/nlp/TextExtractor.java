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

@Component
public class TextExtractor {

    private final Tika tika = new Tika();

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

    // ✅ PDFBox 3.x uses Loader.loadPDF() instead of PDDocument.load()
    private String extractFromPDF(MultipartFile file) throws IOException {
        byte[] bytes = file.getBytes();
        try (PDDocument document = Loader.loadPDF(bytes)) {
            PDFTextStripper stripper = new PDFTextStripper();
            String text = stripper.getText(document);
            return cleanText(text);
        }
    }

    // DOCX extraction using Apache Tika
    private String extractFromDOCX(MultipartFile file) throws IOException, TikaException {
        try (InputStream inputStream = file.getInputStream()) {
            String text = tika.parseToString(inputStream);
            return cleanText(text);
        }
    }

    // Clean up extracted text
    private String cleanText(String text) {
        if (text == null) return "";
        return text
                .replaceAll("\\s+", " ")
                .replaceAll("[\r\n]+", "\n")
                .trim();
    }
}