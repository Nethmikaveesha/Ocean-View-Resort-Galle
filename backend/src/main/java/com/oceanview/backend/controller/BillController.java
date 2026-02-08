package com.oceanview.backend.controller;

import com.oceanview.backend.model.Reservation;
import com.oceanview.backend.repository.ReservationRepository;
import com.itextpdf.text.*;
import com.itextpdf.text.pdf.PdfWriter;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import javax.swing.text.Document;

@RestController
@RequestMapping("/api/bill")
public class BillController {

    @Autowired
    private ReservationRepository repo;

    @GetMapping("/{id}")
    public void generateBill(@PathVariable String id,
                             HttpServletResponse response) throws Exception {

        Reservation r = repo.findById(id).get();

        response.setContentType("application/pdf");
        Document doc = new Document();
        PdfWriter.getInstance(doc, response.getOutputStream());

        doc.open();
        doc.add(new Paragraph("Ocean View Resort"));
        doc.add(new Paragraph("Reservation: " + r.getReservationNumber()));
        doc.add(new Paragraph("Guest: " + r.getGuestName()));
        doc.add(new Paragraph("Total Bill: Rs. " + r.getTotalBill()));
        doc.close();
    }
}
