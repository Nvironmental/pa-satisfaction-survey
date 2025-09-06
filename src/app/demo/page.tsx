import Link from "next/link";

export default function DemoPage() {
  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-center mb-8 text-gray-800">
          Email Demo Center
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Thank You Email Demos */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-2xl font-semibold mb-4 text-blue-600">
              Thank You Email Demos
            </h2>
            <p className="text-gray-600 mb-6">
              Preview the thank you emails that are sent after survey
              completion, including subquestion support and CSAT score display.
            </p>

            <div className="space-y-4">
              <Link
                href="/demo/thank-you-email"
                className="block w-full bg-blue-600 text-white py-3 px-4 rounded-lg text-center hover:bg-blue-700 transition-colors"
              >
                Full Preview (Side by Side)
              </Link>

              <Link
                href="/demo/thank-you-email/raw"
                className="block w-full bg-green-600 text-white py-3 px-4 rounded-lg text-center hover:bg-green-700 transition-colors"
              >
                Raw Email View
              </Link>
            </div>

            <div className="mt-6 p-4 bg-blue-50 rounded-lg">
              <h3 className="font-medium text-blue-800 mb-2">
                Features Demonstrated:
              </h3>
              <ul className="text-sm text-blue-700 space-y-1">
                <li>• Subquestion display with visual hierarchy</li>
                <li>• CSAT score presentation</li>
                <li>• Question numbering and organization</li>
                <li>• Professional email styling</li>
                <li>• Both client and candidate survey examples</li>
              </ul>
            </div>
          </div>

          {/* Survey Email Demos */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-2xl font-semibold mb-4 text-green-600">
              Survey Invitation Emails
            </h2>
            <p className="text-gray-600 mb-6">
              Preview the initial survey invitation emails sent to clients and
              candidates.
            </p>

            <div className="space-y-4">
              <div className="p-4 bg-gray-50 rounded-lg">
                <p className="text-sm text-gray-600">
                  Survey invitation emails are available in the main
                  application. These are the emails sent when surveys are first
                  distributed.
                </p>
              </div>
            </div>

            <div className="mt-6 p-4 bg-green-50 rounded-lg">
              <h3 className="font-medium text-green-800 mb-2">
                Available Templates:
              </h3>
              <ul className="text-sm text-green-700 space-y-1">
                <li>• Client Satisfaction Survey Email</li>
                <li>• Candidate Satisfaction Survey Email</li>
                <li>• OTP Email for Authentication</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="mt-8 bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-xl font-semibold mb-4 text-gray-800">
            Demo Statistics
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600">2</div>
              <div className="text-sm text-gray-600">Email Templates</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-green-600">18</div>
              <div className="text-sm text-gray-600">Sample Questions</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-purple-600">5</div>
              <div className="text-sm text-gray-600">Subquestions</div>
            </div>
          </div>
        </div>

        {/* Instructions */}
        <div className="mt-8 bg-yellow-50 border border-yellow-200 rounded-lg p-6">
          <h3 className="font-medium text-yellow-800 mb-2">
            How to Use These Demos
          </h3>
          <ol className="text-sm text-yellow-700 space-y-2">
            <li>
              1. <strong>Full Preview:</strong> Shows both client and candidate
              emails side by side with metadata
            </li>
            <li>
              2. <strong>Raw Email View:</strong> Shows the actual email as it
              would appear in an email client
            </li>
            <li>
              3. <strong>Sample Data:</strong> All demos use realistic sample
              data including subquestions
            </li>
            <li>
              4. <strong>Responsive Design:</strong> Emails are designed to work
              across different email clients
            </li>
          </ol>
        </div>
      </div>
    </div>
  );
}
