import React from 'react';
import { AndroidHeader } from './figma-message-ui';
import verificationIcon from '@/assets/verification_icon.svg';

interface BrandPreviewExampleProps {
  brandName: string;
  brandLogoUrl: string;
  showVerificationBadge?: boolean;
}

/**
 * This component demonstrates how to use the AndroidHeader component with 
 * specific brand information from each project.
 * 
 * Example Usage:
 * <BrandPreviewExample 
 *   brandName="Bridgepoint Runners" 
 *   brandLogoUrl="/path/to/bridgepoint_logo.png"
 *   showVerificationBadge={true}
 * />
 */
export const BrandPreviewExample: React.FC<BrandPreviewExampleProps> = ({
  brandName,
  brandLogoUrl,
  showVerificationBadge = true
}) => {
  return (
    <div className="border border-gray-300 rounded-lg overflow-hidden">
      <div className="p-4">
        <h3 className="text-lg font-medium mb-4">Brand Header Preview</h3>
        <div className="max-w-[400px] mx-auto overflow-hidden rounded-lg shadow-sm">
          <AndroidHeader 
            brandName={brandName}
            brandLogoUrl={brandLogoUrl}
            verificationBadgeUrl={verificationIcon}
            verificationSymbol={showVerificationBadge}
          />
        </div>
        <div className="mt-4 text-sm text-gray-500">
          <p>This is how your brand will appear in the RCS message header.</p>
          <p className="mt-2">
            <strong>Note:</strong> The verification badge indicates that this is an official business account.
          </p>
        </div>
      </div>
    </div>
  );
};

export default BrandPreviewExample;