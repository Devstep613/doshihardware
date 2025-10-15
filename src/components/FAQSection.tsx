import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const FAQSection = () => {
  const faqs = [
    {
      id: "item-1",
      question: "Do you deliver outside Nairobi?",
      answer: "Yes, we deliver throughout Kenya. Delivery charges vary by location and order size. Contact us for a specific quote for your area."
    },
    {
      id: "item-2",
      question: "Can I buy in bulk?",
      answer: "Absolutely! We offer competitive bulk pricing for construction companies, contractors, and large projects. Contact our sales team for wholesale rates and special arrangements."
    },
    {
      id: "item-3",
      question: "Do prices include transport?",
      answer: "Our listed prices are for materials only. Transportation costs are calculated separately based on delivery location and order volume. We offer free delivery for orders above KSh 50,000 within Nairobi."
    },
    {
      id: "item-4",
      question: "What payment methods do you accept?",
      answer: "We accept cash, bank transfers, mobile money (M-Pesa), and major credit cards. For large orders, we can arrange payment terms with approved customers."
    },
    {
      id: "item-5",
      question: "Do you provide installation services?",
      answer: "While we specialize in supplying quality building materials, we can recommend certified contractors for installation services. We don't provide installation ourselves but can connect you with trusted professionals."
    },
    {
      id: "item-6",
      question: "What is your return policy?",
      answer: "We accept returns within 7 days for unopened, undamaged products in original packaging. Custom orders and certain materials like cement cannot be returned once opened. Please inspect your order upon delivery."
    }
  ];

  return (
    <section className="py-16 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold mb-4">Frequently Asked Questions</h2>
          <p className="text-xl text-muted-foreground">Everything you need to know about our services</p>
        </div>

        <div className="max-w-3xl mx-auto">
          <Accordion type="single" collapsible className="w-full">
            {faqs.map((faq) => (
              <AccordionItem key={faq.id} value={faq.id}>
                <AccordionTrigger className="text-left">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>

        <div className="text-center mt-8">
          <p className="text-muted-foreground mb-4">
            Still have questions? We're here to help!
          </p>
          <a
            href="tel:+254107500245"
            className="inline-flex items-center px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors duration-300 font-medium"
          >
            Call Us: +254 107 500 245 / +254 753 249 744
          </a>
        </div>
      </div>
    </section>
  );
};

export default FAQSection;
