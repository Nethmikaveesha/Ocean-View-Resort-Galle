package com.oceanview.backend.controller;

import com.oceanview.backend.model.Reservation;
import com.oceanview.backend.repository.ReservationRepository;
import com.itextpdf.text.Document;
import com.itextpdf.text.Paragraph;
import com.itextpdf.text.pdf.PdfWriter;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/bill")
public class BillController {

    @Autowired
    private ReservationRepository repo;

    @GetMapping("/{id}")
    public void generateBill(@PathVariable String id,
                             HttpServletResponse response) throws Exception {

        Reservation r = repo.findById(id).orElseThrow();

        response.setContentType("application/pdf");

        Document document = new Document();
        PdfWriter.getInstance(document, response.getOutputStream());

        document.open();
        document.add(new Paragraph("Ocean View Resort"));
        document.add(new Paragraph("Reservation Number: " + r.getReservationNumber()));
        document.add(new Paragraph("Guest Name: " + r.getGuestName()));
        document.add(new Paragraph("Total Bill: Rs. " + r.getTotalBill()));
        document.close();
    }
}