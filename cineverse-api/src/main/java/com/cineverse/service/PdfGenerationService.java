package com.cineverse.service;

import com.cineverse.entity.Booking;
import com.cineverse.entity.Movie;
import com.lowagie.text.*;
import com.lowagie.text.pdf.PdfPCell;
import com.lowagie.text.pdf.PdfPTable;
import com.lowagie.text.pdf.PdfWriter;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import java.awt.Color;
import java.io.ByteArrayOutputStream;
import java.time.format.DateTimeFormatter;

@Service
public class PdfGenerationService {

    private static final Logger logger = LoggerFactory.getLogger(PdfGenerationService.class);

    public byte[] generateTicketPdf(Booking booking, Movie movie) {
        try (ByteArrayOutputStream baos = new ByteArrayOutputStream()) {
            Document document = new Document(PageSize.A4, 50, 50, 50, 50);
            PdfWriter.getInstance(document, baos);
            document.open();

            // Fonts
            Font titleFont = FontFactory.getFont(FontFactory.HELVETICA_BOLD, 28, Color.decode("#4f46e5"));
            Font subtitleFont = FontFactory.getFont(FontFactory.HELVETICA_BOLD, 18, Color.DARK_GRAY);
            Font normalFont = FontFactory.getFont(FontFactory.HELVETICA, 12, Color.BLACK);
            Font headerFont = FontFactory.getFont(FontFactory.HELVETICA_BOLD, 12, Color.WHITE);

            // Header
            Paragraph title = new Paragraph("Cineverse Movie Ticket", titleFont);
            title.setAlignment(Element.ALIGN_CENTER);
            title.setSpacingAfter(30);
            document.add(title);

            // Movie Title
            Paragraph movieTitle = new Paragraph(movie.getTitle(), subtitleFont);
            movieTitle.setAlignment(Element.ALIGN_CENTER);
            movieTitle.setSpacingAfter(10);
            document.add(movieTitle);

            // User Email
            Paragraph userEmail = new Paragraph("Booked by: " + booking.getUserEmail(), normalFont);
            userEmail.setAlignment(Element.ALIGN_CENTER);
            userEmail.setSpacingAfter(30);
            document.add(userEmail);

            // Ticket Details Table
            PdfPTable table = new PdfPTable(2);
            table.setWidthPercentage(100);
            table.setSpacingBefore(10f);
            table.setSpacingAfter(10f);

            // Table Header
            PdfPCell cell = new PdfPCell(new Phrase("Ticket Details", headerFont));
            cell.setColspan(2);
            cell.setHorizontalAlignment(Element.ALIGN_CENTER);
            cell.setBackgroundColor(Color.decode("#4f46e5"));
            cell.setPadding(10);
            table.addCell(cell);

            // Rows
            addTableRow(table, "Booking ID:", String.valueOf(booking.getId()), normalFont);
            addTableRow(table, "Date:", booking.getShowDate(), normalFont);
            addTableRow(table, "Seats:", booking.getSeats(), normalFont);
            addTableRow(table, "Total Seats:", String.valueOf(booking.getTotalSeats()), normalFont);
            
            // Assuming 15$ per ticket for display purposes as it's not strictly tracked in DB
            double totalAmount = booking.getTotalSeats() * 15.0;
            addTableRow(table, "Total Paid:", "$" + String.format("%.2f", totalAmount), normalFont);

            document.add(table);

            // Footer
            Paragraph footer = new Paragraph("Please present this ticket at the entrance.\nEnjoy the movie!", normalFont);
            footer.setAlignment(Element.ALIGN_CENTER);
            footer.setSpacingBefore(50);
            document.add(footer);

            document.close();
            return baos.toByteArray();
        } catch (Exception e) {
            logger.error("Error generating PDF ticket: ", e);
            throw new RuntimeException("Could not generate PDF ticket", e);
        }
    }

    private void addTableRow(PdfPTable table, String label, String value, Font font) {
        PdfPCell labelCell = new PdfPCell(new Phrase(label, font));
        labelCell.setPadding(8);
        labelCell.setBackgroundColor(Color.decode("#f9fafb"));
        labelCell.setBorderColor(Color.decode("#e5e7eb"));

        PdfPCell valueCell = new PdfPCell(new Phrase(value, font));
        valueCell.setPadding(8);
        valueCell.setBorderColor(Color.decode("#e5e7eb"));

        table.addCell(labelCell);
        table.addCell(valueCell);
    }
}
