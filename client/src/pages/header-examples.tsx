import React from 'react';
import { BrandPreviewExample } from '@/components/image-formatter/brand-preview-example';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

/**
 * This page demonstrates how RCS message headers will look for different brands
 * with their logos and verification badges.
 */
const HeaderExamplesPage: React.FC = () => {
  // Sample brands with their logos
  const brands = [
    {
      name: 'Bridgepoint Runners',
      logoUrl: '/uploads/bridgepoint_logo.png', // This would be a real logo path in production
      verified: true
    },
    {
      name: 'GlobalTech Solutions',
      logoUrl: '/uploads/globaltech_logo.png', // This would be a real logo path in production
      verified: true
    },
    {
      name: 'Fresh Organics',
      logoUrl: '/uploads/fresh_organics_logo.png', // This would be a real logo path in production
      verified: false
    }
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">RCS Message Header Examples</h1>
        <p className="text-gray-600">
          These examples show how brand headers will appear in RCS messages on Android and iOS devices.
          The verification badge indicates an official business account.
        </p>
      </div>

      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Android RCS Headers</CardTitle>
          <CardDescription>
            Android RCS messages display the business name, logo, and a verification badge if the business is verified.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {brands.map((brand, index) => (
              <BrandPreviewExample
                key={index}
                brandName={brand.name}
                brandLogoUrl={brand.logoUrl}
                showVerificationBadge={brand.verified}
              />
            ))}
          </div>
        </CardContent>
      </Card>

      <div className="mt-8 bg-gray-100 p-4 rounded-lg">
        <h3 className="text-lg font-medium mb-2">How to Customize Your Brand Header</h3>
        <ol className="list-decimal pl-5 space-y-2">
          <li>Upload your brand logo in the Brand Management section</li>
          <li>Ensure your logo is high-quality and properly sized (224x224 pixels recommended)</li>
          <li>Set your official business name</li>
          <li>Apply for verification if eligible</li>
          <li>Preview your RCS messages in the RCS Formatter section</li>
        </ol>
      </div>
    </div>
  );
};

export default HeaderExamplesPage;