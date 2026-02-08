package com.oceanview.backend.controller;

import com.itextpdf.text.Document;
import com.itextpdf.text.Paragraph;
import com.itextpdf.text.pdf.PdfWriter;
import com.oceanview.backend.model.Reservation;
import com.oceanview.backend.repository.ReservationRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.io.ByteArrayOutputStream;

@RestController
@RequestMapping("/api/bills")
public class BillController {

    @Autowired
    private ReservationRepository reservationRepository;

    @GetMapping("/{reservationNumber}")
    public ResponseEntity<byte[]> generateBill(@PathVariable String reservationNumber) {
        try {
            Reservation reservation = reservationRepository.findById(reservationNumber)
                    .orElseThrow(() -> new RuntimeException("Reservation not found"));

            ByteArrayOutputStream out = new ByteArrayOutputStream();
            Document document = new Document();
            PdfWriter.getInstance(document, out);

            document.open();
            document.add(new Paragraph("Ocean View Resort - Galle"));
            document.add(new Paragraph(" "));
            document.add(new Paragraph("Reservation Number: " + reservation.getReservationNumber()));
            document.add(new Paragraph("Guest Name: " + reservation.getGuestName()));
            document.add(new Paragraph("Room Type: " + reservation.getRoom().getRoomType()));
            document.add(new Paragraph("Check-in Date: " + reservation.getCheckInDate()));
            document.add(new Paragraph("Check-out Date: " + reservation.getCheckOutDate()));
            document.add(new Paragraph("Time: " + reservation.getTime()));
            document.add(new Paragraph(" "));
            document.add(new Paragraph("Total Bill: LKR " + reservation.getTotalBill()));
            document.close();

            return ResponseEntity.ok()
                    .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=bill.pdf")
                    .contentType(MediaType.APPLICATION_PDF)
                    .body(out.toByteArray());

        } catch (Exception e) {
            return ResponseEntity.internalServerError().build();
        }
    }
}