const PrivacyPage = () => {
  return (
    <div className="container mx-auto px-4 py-16">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-gray-900 dark:text-gray-100 mb-8">
          Privacy Policy
        </h1>
        
        <div className="prose prose-lg dark:prose-invert max-w-none space-y-6">
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Last updated: December 2, 2025
          </p>

          <p className="text-lg text-gray-700 dark:text-gray-300 leading-relaxed">
            At MITC Store, we are committed to protecting your privacy and ensuring the security of your personal
            information. This Privacy Policy explains how we collect, use, and safeguard your data.
          </p>

          <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mt-8 mb-4">
            Information We Collect
          </h2>
          <p className="text-gray-700 dark:text-gray-300">
            We collect information that you provide directly to us, including:
          </p>
          <ul className="list-disc list-inside space-y-2 text-gray-700 dark:text-gray-300">
            <li>Name and contact information</li>
            <li>Email address and phone number</li>
            <li>Purchase history and product preferences</li>
            <li>Warranty and service records</li>
          </ul>

          <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mt-8 mb-4">
            How We Use Your Information
          </h2>
          <p className="text-gray-700 dark:text-gray-300">
            We use the information we collect to:
          </p>
          <ul className="list-disc list-inside space-y-2 text-gray-700 dark:text-gray-300">
            <li>Process your purchases and provide customer service</li>
            <li>Send warranty reminders and service notifications</li>
            <li>Improve our products and services</li>
            <li>Communicate with you about new products and offers (with your consent)</li>
          </ul>

          <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mt-8 mb-4">
            Data Security
          </h2>
          <p className="text-gray-700 dark:text-gray-300">
            We implement appropriate technical and organizational measures to protect your personal information
            against unauthorized access, alteration, disclosure, or destruction.
          </p>

          <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mt-8 mb-4">
            Information Sharing
          </h2>
          <p className="text-gray-700 dark:text-gray-300">
            We do not sell, trade, or rent your personal information to third parties. We may share your information
            only:
          </p>
          <ul className="list-disc list-inside space-y-2 text-gray-700 dark:text-gray-300">
            <li>With your explicit consent</li>
            <li>To comply with legal obligations</li>
            <li>To protect our rights and property</li>
          </ul>

          <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mt-8 mb-4">
            Your Rights
          </h2>
          <p className="text-gray-700 dark:text-gray-300">
            You have the right to:
          </p>
          <ul className="list-disc list-inside space-y-2 text-gray-700 dark:text-gray-300">
            <li>Access your personal information</li>
            <li>Correct inaccurate data</li>
            <li>Request deletion of your data</li>
            <li>Opt-out of marketing communications</li>
          </ul>

          <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mt-8 mb-4">
            Contact Us
          </h2>
          <p className="text-gray-700 dark:text-gray-300">
            If you have any questions about this Privacy Policy or our data practices, please contact us at
            info@mitc.com or visit our store in Srinagar.
          </p>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPage;