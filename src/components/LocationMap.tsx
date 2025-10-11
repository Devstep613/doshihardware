const LocationMap = () => {
  return (
    <section className="py-16 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="text-center mb-8">
          <h2 className="text-4xl font-bold mb-4">Find Us</h2>
          <p className="text-xl text-muted-foreground">Visit our store or get directions</p>
        </div>

        <div className="max-w-4xl mx-auto">
          <div className="aspect-video rounded-lg overflow-hidden shadow-lg">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3988.8192!2d36.8219!3d-1.2921!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMcKwMTcnMzEuNiJTIDM2wrA0OScwMy4wIkU!5e0!3m2!1sen!2ske!4v1634567890123!5m2!1sen!2ske"
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="Doshi Hardware Store Location"
            ></iframe>
          </div>

          <div className="mt-8 text-center">
            <h3 className="text-2xl font-semibold mb-2">Doshi Hardware Stores</h3>
            <p className="text-muted-foreground mb-4">
              Nairobi, Kenya<br />
              Phone: +254 107 500 245<br />
              Email: stepnjoroge0@gmail.com
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default LocationMap;
