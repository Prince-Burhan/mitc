const AboutPage = () => {
  return (
    <div className="container mx-auto px-4 py-16">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-gray-900 dark:text-gray-100 mb-8">
          About MITC Store
        </h1>
        
        <div className="prose prose-lg dark:prose-invert max-w-none space-y-6">
          <p className="text-lg text-gray-700 dark:text-gray-300 leading-relaxed">
            Welcome to Mateen IT Corp. (MITC) - your trusted destination for premium laptops in Srinagar, Kashmir.
          </p>

          <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mt-8 mb-4">
            Our Story
          </h2>
          <p className="text-gray-700 dark:text-gray-300">
            Founded with a vision to provide quality computing solutions, MITC has been serving the Kashmir valley
            with dedication and excellence. We specialize in offering a curated selection of laptops ranging from
            premium business machines to budget-friendly options for students.
          </p>

          <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mt-8 mb-4">
            What We Offer
          </h2>
          <ul className="list-disc list-inside space-y-2 text-gray-700 dark:text-gray-300">
            <li>Wide range of laptops from top brands</li>
            <li>Expert guidance to help you choose the right laptop</li>
            <li>Competitive pricing and special deals</li>
            <li>15-day testing warranty on all purchases</li>
            <li>After-sales support and assistance</li>
            <li>Trade-in options for your old devices</li>
          </ul>

          <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mt-8 mb-4">
            Our Commitment
          </h2>
          <p className="text-gray-700 dark:text-gray-300">
            At MITC, we believe in building long-term relationships with our customers. Every laptop we sell comes
            with our commitment to quality and service. We're not just selling computers; we're providing solutions
            that empower your work, studies, and creativity.
          </p>

          <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mt-8 mb-4">
            Visit Us
          </h2>
          <p className="text-gray-700 dark:text-gray-300">
            Come visit our showroom in Maisuma, near Gaw Kadal Bridge, Srinagar. Our team is ready to help you
            find the perfect laptop for your needs.
          </p>
        </div>
      </div>
    </div>
  );
};

export default AboutPage;