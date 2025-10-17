import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export function PlatformComparisonGuide() {
  return (
    <Card className="mt-6">
      <CardHeader>
        <CardTitle className="text-lg flex items-center gap-2">
          Platform Comparison: Android vs iOS
          <Badge variant="outline">RCS Business Messaging</Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid md:grid-cols-2 gap-6">
          {/* Android Column */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-8 h-8 rounded-full bg-green-500 flex items-center justify-center">
                <span className="text-white font-bold">A</span>
              </div>
              <h3 className="font-semibold text-base">Android (Google RCS)</h3>
            </div>
            
            <div className="space-y-3">
              <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                <h4 className="font-medium text-sm mb-2">✓ Action Display</h4>
                <p className="text-xs text-gray-700">Material Design 3 chips - inline, pill-shaped buttons with icons</p>
                <div className="mt-2 flex flex-wrap gap-2">
                  <span className="px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-xs border border-blue-200">Shop Now</span>
                  <span className="px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-xs border border-blue-200">Call Us</span>
                </div>
              </div>
              
              <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                <h4 className="font-medium text-sm mb-2">📝 Text Rendering</h4>
                <ul className="text-xs text-gray-700 space-y-1">
                  <li>• Line breaks: Fully respected</li>
                  <li>• Title: Up to 200 chars, 16px font</li>
                  <li>• Description: Up to 2000 chars, 14px font</li>
                  <li>• No automatic truncation</li>
                </ul>
              </div>
              
              <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                <h4 className="font-medium text-sm mb-2">🖼️ Image Support</h4>
                <ul className="text-xs text-gray-700 space-y-1">
                  <li>• JPEG, PNG, GIF (animated ✓), WebP</li>
                  <li>• object-cover cropping by default</li>
                  <li>• Max: 1500x1000px, 1.8MB</li>
                  <li>• Fills full card width</li>
                </ul>
              </div>

              <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                <h4 className="font-medium text-sm mb-2">🎯 Chips vs Replies</h4>
                <p className="text-xs text-gray-700">Chips (actions): Blue filled background</p>
                <p className="text-xs text-gray-700 mt-1">Replies: Gray outlined chips</p>
              </div>
            </div>
          </div>
          
          {/* iOS Column */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center">
                <span className="text-white font-bold">i</span>
              </div>
              <h3 className="font-semibold text-base">iOS (Business Chat)</h3>
            </div>
            
            <div className="space-y-3">
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                <h4 className="font-medium text-sm mb-2">✓ Action Display</h4>
                <p className="text-xs text-gray-700">List-style items with chevrons (›) in vertical menu</p>
                <div className="mt-2 bg-white border border-gray-200 rounded-lg overflow-hidden">
                  <div className="px-3 py-2 text-xs text-blue-500 border-b border-gray-200 flex justify-between">
                    <span>Shop Now</span>
                    <span className="text-gray-400">›</span>
                  </div>
                  <div className="px-3 py-2 text-xs text-blue-500 flex justify-between">
                    <span>Call Us</span>
                    <span className="text-gray-400">›</span>
                  </div>
                </div>
              </div>
              
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                <h4 className="font-medium text-sm mb-2">📝 Text Rendering</h4>
                <ul className="text-xs text-gray-700 space-y-1">
                  <li>• Line breaks: May compress to spaces</li>
                  <li>• Title: ~60 chars max (2 lines), 15px font</li>
                  <li>• Description: ~144 chars (3 lines), 13px</li>
                  <li>• Automatic truncation with ellipsis (...)</li>
                </ul>
              </div>
              
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                <h4 className="font-medium text-sm mb-2">🖼️ Image Support</h4>
                <ul className="text-xs text-gray-700 space-y-1">
                  <li>• JPEG, PNG only - NO GIF ✗</li>
                  <li>• object-contain preferred (no crop)</li>
                  <li>• Max: 1500x1000px, 1.8MB</li>
                  <li>• May letterbox to preserve aspect</li>
                </ul>
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                <h4 className="font-medium text-sm mb-2">🎯 Chips vs Replies</h4>
                <p className="text-xs text-gray-700">Both shown as white rounded buttons</p>
                <p className="text-xs text-gray-700 mt-1">Visual difference minimal</p>
              </div>
            </div>
          </div>
        </div>
        
        {/* Key Differences Summary */}
        <div className="mt-6 bg-gradient-to-r from-amber-50 to-orange-50 border-2 border-amber-300 rounded-lg p-4">
          <h3 className="font-semibold text-base mb-3 text-gray-900">🔑 Critical Differences to Consider:</h3>
          <div className="grid md:grid-cols-3 gap-4">
            <div>
              <p className="font-medium text-sm text-gray-900 mb-1">CTA Behavior</p>
              <p className="text-xs text-gray-700"><strong>Android:</strong> All visible inline</p>
              <p className="text-xs text-gray-700"><strong>iOS:</strong> Tap to expand list</p>
            </div>
            <div>
              <p className="font-medium text-sm text-gray-900 mb-1">Character Limits</p>
              <p className="text-xs text-gray-700"><strong>Android:</strong> 200/2000 chars</p>
              <p className="text-xs text-gray-700"><strong>iOS:</strong> ~60/144 chars visible</p>
            </div>
            <div>
              <p className="font-medium text-sm text-gray-900 mb-1">Image Formats</p>
              <p className="text-xs text-gray-700"><strong>Android:</strong> GIF, WebP ✓</p>
              <p className="text-xs text-gray-700"><strong>iOS:</strong> JPEG, PNG only</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

