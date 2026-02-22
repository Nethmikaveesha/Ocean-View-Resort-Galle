package com.oceanview.backend.controller;

import com.itextpdf.text.*;
import com.itextpdf.text.pdf.PdfPCell;
import com.itextpdf.text.pdf.PdfPTable;
import com.itextpdf.text.pdf.PdfWriter;
import com.itextpdf.text.pdf.draw.LineSeparator;
import com.oceanview.backend.model.Reservation;
import com.oceanview.backend.repository.ReservationRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.io.ByteArrayOutputStream;
import java.text.NumberFormat;
import java.util.Locale;

@RestController
@RequestMapping("/api/bills")
public class BillController {

    private static final BaseColor ACCENT_COLOR = new BaseColor(6, 182, 212);  // cyan-500
    private static final BaseColor HEADER_BG = new BaseColor(241, 245, 249);   // slate-100
    private static final BaseColor TEXT_MUTED = new BaseColor(100, 116, 139);  // slate-400

    @Autowired
    private ReservationRepository reservationRepository;

    @GetMapping("/{reservationNumber}")
    public ResponseEntity<byte[]> generateBill(@PathVariable String reservationNumber) {
        try {
            Reservation reservation = reservationRepository.findById(reservationNumber)
                    .orElseThrow(() -> new RuntimeException("Reservation not found"));

            ByteArrayOutputStream out = new ByteArrayOutputStream();
            Document document = new Document(PageSize.A5);
            document.setMargins(36, 36, 48, 36);
            PdfWriter.getInstance(document, out);

            document.open();

            // Header with resort name
            Font headerFont = FontFactory.getFont(FontFactory.HELVETICA_BOLD, 22, ACCENT_COLOR);
            Paragraph title = new Paragraph("Ocean View Resort", headerFont);
            title.setAlignment(Element.ALIGN_CENTER);
            title.setSpacingAfter(2);
            document.add(title);

            Font subFont = FontFactory.getFont(FontFactory.HELVETICA, 12, TEXT_MUTED);
            Paragraph subtitle = new Paragraph("Galle, Sri Lanka", subFont);
            subtitle.setAlignment(Element.ALIGN_CENTER);
            subtitle.setSpacingAfter(20);
            document.add(subtitle);

            // Decorative line
            LineSeparator line = new LineSeparator();
            line.setLineColor(ACCENT_COLOR);
            line.setLineWidth(2);
            line.setPercentage(60);
            line.setAlignment(Element.ALIGN_CENTER);
            document.add(line);
            document.add(new Paragraph(" "));

            // Reservation details table
            PdfPTable table = new PdfPTable(2);
            table.setWidthPercentage(100);
            table.setSpacingBefore(16);
            table.setSpacingAfter(16);
            table.getDefaultCell().setBorder(Rectangle.NO_BORDER);
            table.getDefaultCell().setPadding(8);

            Font labelFont = FontFactory.getFont(FontFactory.HELVETICA, 10, TEXT_MUTED);
            Font valueFont = FontFactory.getFont(FontFactory.HELVETICA_BOLD, 10, BaseColor.BLACK);

            addRow(table, "Reservation Number", reservation.getReservationNumber(), labelFont, valueFont);
            addRow(table, "Guest Name", reservation.getGuestName(), labelFont, valueFont);
            addRow(table, "Room Type", reservation.getRoomType(), labelFont, valueFont);
            addRow(table, "Check-in Date", String.valueOf(reservation.getCheckIn()), labelFont, valueFont);
            addRow(table, "Check-out Date", String.valueOf(reservation.getCheckOut()), labelFont, valueFont);

            document.add(table);

            // Total bill highlighted box
            String formattedBill = NumberFormat.getNumberInstance(Locale.US).format(reservation.getTotalBill());
            if (formattedBill.contains(".") && formattedBill.endsWith("0")) {
                formattedBill = formattedBill.replaceAll("\\.0+$", "");
            }

            PdfPTable totalTable = new PdfPTable(1);
            totalTable.setWidthPercentage(100);
            totalTable.setSpacingBefore(12);
            totalTable.getDefaultCell().setBorder(Rectangle.NO_BORDER);
            totalTable.getDefaultCell().setPadding(16);
            totalTable.getDefaultCell().setHorizontalAlignment(Element.ALIGN_CENTER);

            Font totalLabelFont = FontFactory.getFont(FontFactory.HELVETICA, 11, TEXT_MUTED);
            Font totalValueFont = FontFactory.getFont(FontFactory.HELVETICA_BOLD, 18, ACCENT_COLOR);

            PdfPCell totalCell = new PdfPCell();
            totalCell.setBorder(Rectangle.NO_BORDER);
            totalCell.setPadding(16);
            totalCell.setHorizontalAlignment(Element.ALIGN_CENTER);
            totalCell.setBackgroundColor(HEADER_BG);

            Phrase totalPhrase = new Phrase();
            totalPhrase.add(new Chunk("Total Bill ", totalLabelFont));
            totalPhrase.add(new Chunk("LKR " + formattedBill, totalValueFont));
            totalCell.addElement(totalPhrase);
            totalTable.addCell(totalCell);

            document.add(totalTable);

            // Footer
            document.add(new Paragraph(" "));
            Font footerFont = FontFactory.getFont(FontFactory.HELVETICA_OBLIQUE, 8, TEXT_MUTED);
            Paragraph footer = new Paragraph("Thank you for choosing Ocean View Resort. We look forward to welcoming you.", footerFont);
            footer.setAlignment(Element.ALIGN_CENTER);
            document.add(footer);

            document.close();

            String filename = "bill-" + reservationNumber + ".pdf";
            return ResponseEntity.ok()
                    .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + filename + "\"")
                    .contentType(MediaType.APPLICATION_PDF)
                    .body(out.toByteArray());

        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.internalServerError().build();
        }
    }

    private void addRow(PdfPTable table, String label, String value, Font labelFont, Font valueFont) {
        PdfPCell labelCell = new PdfPCell(new Phrase(label, labelFont));
        labelCell.setBorder(Rectangle.NO_BORDER);
        labelCell.setPadding(6);
        table.addCell(labelCell);

        PdfPCell valueCell = new PdfPCell(new Phrase(value, valueFont));
        valueCell.setBorder(Rectangle.NO_BORDER);
        valueCell.setPadding(6);
        valueCell.setHorizontalAlignment(Element.ALIGN_RIGHT);
        table.addCell(valueCell);
    }
}