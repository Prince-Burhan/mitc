const TermsPage = () => {
  return (
    <div className="container mx-auto px-4 py-16">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-gray-900 dark:text-gray-100 mb-8">
          Terms & Conditions
        </h1>
        
        <div className="prose prose-lg dark:prose-invert max-w-none space-y-6">
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Last updated: December 2, 2025
          </p>

          <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mt-8 mb-4">
            1. General Terms
          </h2>
          <p className="text-gray-700 dark:text-gray-300">
            By accessing and placing an order with MITC Store, you confirm that you are in agreement with and bound
            by the terms and conditions contained in the Terms & Conditions outlined below.
          </p>

          <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mt-8 mb-4">
            2. Products and Services
          </h2>
          <p className="text-gray-700 dark:text-gray-300">
            All products and services are subject to availability. We reserve the right to discontinue any products
            at any time. Prices for our products are subject to change without notice.
          </p>

          <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mt-8 mb-4">
            3. Testing Warranty
          </h2>
          <p className="text-gray-700 dark:text-gray-300">
            We provide a 15-day testing warranty on all laptop purchases. During this period, customers can report
            any manufacturing defects or issues. The warranty does not cover physical damage, water damage, or
            software issues caused by the user.
          </p>

          <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mt-8 mb-4">
            4. Returns and Exchanges
          </h2>
          <p className="text-gray-700 dark:text-gray-300">
            Returns are accepted within 3 days of purchase only in case of manufacturing defects. The product must
            be in its original condition with all accessories and packaging. Custom configured products cannot be
            returned.
          </p>

          <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mt-8 mb-4">
            5. Payment Terms
          </h2>
          <p className="text-gray-700 dark:text-gray-300">
            We accept cash payments at our store. For high-value purchases, we may require advance payment or down
            payment. All prices are in Indian Rupees (INR) and include applicable taxes.
          </p>

          <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mt-8 mb-4">
            6. Limitation of Liability
          </h2>
          <p className="text-gray-700 dark:text-gray-300">
            MITC Store shall not be held responsible for any direct, indirect, incidental, or consequential damages
            arising from the use or inability to use our products or services.
          </p>

          <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mt-8 mb-4">
            7. Contact Information
          </h2>
          <p className="text-gray-700 dark:text-gray-300">
            If you have any questions about these Terms & Conditions, please contact us at info@mitc.com or visit
            our store.
          </p>
        </div>
      </div>
    </div>
  );
};

export default TermsPage;