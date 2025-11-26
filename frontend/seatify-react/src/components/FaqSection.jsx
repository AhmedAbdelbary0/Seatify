import React, { useState } from "react";
import "../styles/style.css";

function FaqSection() {
  const faqs = [
    {
      question: "How does Seatify help me manage my venue?",
      answer:
        "Seatify lets you design the layout and share a QR code for instant bookings. This simplify the seating process for small-scale venues and rooms.",
    },
    {
      question: "Can I customize seat layouts for different events?",
      answer: "Absolutely. You can create unique seating designs for every event.",
    },
    {
      question: "Do my attendees need to install an app to book?",
      answer:
        "Nope. Attendees simply scan the event’s QR code and book directly through their browser.",
    },
    {
      question: "Can I manage multiple venues under one account?",
      answer:
        "Yes. Seatify lets you create and manage multiple spaces within one account.",
    },
    {
      question: "How can I track bookings?",
      answer:
        "Seatify provides real-time insights showing seat occupancy and bookings.",
    },
  ];

  const [openIndex, setOpenIndex] = useState(null);

  return (
    <section id="faq" className="faq-section">
      <h2 className="faq-title">Frequently Asked Questions</h2>

      <div className="faq-container">
        {faqs.map((faq, index) => (
          <div key={index} className="faq-item">
            <div
              className="faq-question"
              onClick={() => setOpenIndex(openIndex === index ? null : index)}
            >
              <span>{faq.question}</span>
              <span className="faq-toggle">
                {openIndex === index ? "▾" : "▸"}
              </span>
            </div>

            {openIndex === index && (
              <div className="faq-answer">{faq.answer}</div>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}

export default FaqSection;
