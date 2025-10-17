import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { previewMediaSizes, convertDpToPx } from "@/lib/media-size-converter";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface MediaSizeReferenceProps {
  currentMediaHeight?: "short" | "medium" | "tall";
}

export function MediaSizeReference({ currentMediaHeight = "medium" }: MediaSizeReferenceProps) {
  const [customDp, setCustomDp] = useState<string>("168");
  const mediaSizes = previewMediaSizes();
  
  const dpValue = parseInt(customDp) || 168;
  
  // Current selection highlighting
  const getCurrentDp = () => {
    switch (currentMediaHeight) {
      case "short": return 112;
      case "medium": return 168;
      case "tall": return 264;
      default: return 168;
    }
  };

  return (
    <Card className="mt-6">
      <CardHeader>
        <CardTitle className="text-lg flex items-center gap-2">
          Media Size Reference: DP → PX Converter
          <Badge variant="outline">RCS Standards</Badge>
        </CardTitle>
        <p className="text-xs text-gray-600 mt-1">
          How your media height translates to actual pixels across different device densities
        </p>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* RCS Standard Heights */}
        <div>
          <h3 className="font-semibold text-sm mb-3 text-gray-900">RCS Standard Media Heights</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-xs border border-gray-200 rounded-lg">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-3 py-2 text-left font-semibold border-b border-r">Size</th>
                  <th className="px-3 py-2 text-left font-semibold border-b border-r">DP</th>
                  <th colSpan={5} className="px-3 py-2 text-center font-semibold border-b bg-green-50">
                    Android Densities (PX)
                  </th>
                  <th colSpan={3} className="px-3 py-2 text-center font-semibold border-b bg-blue-50">
                    iOS Retina (PX)
                  </th>
                </tr>
                <tr className="bg-gray-50">
                  <th className="px-3 py-2 border-b"></th>
                  <th className="px-3 py-2 border-b border-r"></th>
                  <th className="px-2 py-1 text-center border-b border-r text-[10px]">mdpi</th>
                  <th className="px-2 py-1 text-center border-b border-r text-[10px]">hdpi</th>
                  <th className="px-2 py-1 text-center border-b border-r text-[10px]">xhdpi</th>
                  <th className="px-2 py-1 text-center border-b border-r text-[10px]">xxhdpi</th>
                  <th className="px-2 py-1 text-center border-b border-r text-[10px]">xxxhdpi</th>
                  <th className="px-2 py-1 text-center border-b border-r text-[10px]">@1x</th>
                  <th className="px-2 py-1 text-center border-b border-r text-[10px]">@2x</th>
                  <th className="px-2 py-1 text-center border-b text-[10px]">@3x</th>
                </tr>
              </thead>
              <tbody>
                {mediaSizes.map((size, index) => {
                  const isCurrent = size.dp === getCurrentDp();
                  return (
                    <tr 
                      key={index} 
                      className={isCurrent ? "bg-yellow-50 font-semibold" : "hover:bg-gray-50"}
                    >
                      <td className="px-3 py-2 border-b border-r">
                        {size.label}
                        {isCurrent && <Badge variant="secondary" className="ml-2 text-[9px]">Current</Badge>}
                      </td>
                      <td className="px-3 py-2 border-b border-r font-mono text-blue-600">
                        {size.dp} dp
                      </td>
                      <td className="px-2 py-2 text-center border-b border-r font-mono text-[11px]">
                        {size.android.mdpi}px
                      </td>
                      <td className="px-2 py-2 text-center border-b border-r font-mono text-[11px]">
                        {size.android.hdpi}px
                      </td>
                      <td className="px-2 py-2 text-center border-b border-r font-mono text-[11px]">
                        {size.android.xhdpi}px
                      </td>
                      <td className="px-2 py-2 text-center border-b border-r font-mono text-[11px]">
                        {size.android.xxhdpi}px
                      </td>
                      <td className="px-2 py-2 text-center border-b border-r font-mono text-[11px]">
                        {size.android.xxxhdpi}px
                      </td>
                      <td className="px-2 py-2 text-center border-b border-r font-mono text-[11px] bg-blue-50">
                        {size.ios['@1x']}px
                      </td>
                      <td className="px-2 py-2 text-center border-b border-r font-mono text-[11px] bg-blue-50">
                        {size.ios['@2x']}px
                      </td>
                      <td className="px-2 py-2 text-center border-b font-mono text-[11px] bg-blue-50">
                        {size.ios['@3x']}px
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          
          <div className="mt-2 text-[10px] text-gray-500 space-y-1">
            <p><strong>Note:</strong> PX values are calculated using standard density formulas</p>
            <p>• Android baseline: 160 DPI (mdpi) • iOS baseline: 163 PPI (@1x)</p>
          </div>
        </div>

        {/* Custom DP Converter */}
        <div className="border-t pt-4">
          <h3 className="font-semibold text-sm mb-3 text-gray-900">Custom DP Converter</h3>
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="custom-dp" className="text-xs">Enter DP Value</Label>
              <Input
                id="custom-dp"
                type="number"
                value={customDp}
                onChange={(e) => setCustomDp(e.target.value)}
                placeholder="168"
                className="mt-1"
                min="1"
                max="1000"
              />
            </div>
            <div className="flex items-end">
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 w-full">
                <p className="text-xs font-medium text-gray-900 mb-1">
                  {dpValue} DP converts to:
                </p>
                <div className="grid grid-cols-2 gap-2 text-[11px]">
                  <div>
                    <span className="text-gray-600">Android xhdpi:</span>
                    <span className="font-mono ml-1 text-green-700 font-semibold">
                      {convertDpToPx(dpValue, 320)}px
                    </span>
                  </div>
                  <div>
                    <span className="text-gray-600">iOS @2x:</span>
                    <span className="font-mono ml-1 text-blue-700 font-semibold">
                      {convertDpToPx(dpValue, 326)}px
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Density Explanations */}
        <div className="border-t pt-4">
          <h3 className="font-semibold text-sm mb-3 text-gray-900">Density Guide</h3>
          <div className="grid md:grid-cols-2 gap-3">
            {/* Android */}
            <div className="bg-green-50 border border-green-200 rounded-lg p-3">
              <p className="font-medium text-xs text-gray-900 mb-2">📱 Android Densities</p>
              <ul className="space-y-1 text-[11px] text-gray-700">
                <li><strong>mdpi (160 DPI):</strong> Older devices, 1x baseline</li>
                <li><strong>hdpi (240 DPI):</strong> Legacy devices, 1.5x</li>
                <li><strong>xhdpi (320 DPI):</strong> Standard HD, 2x (most common)</li>
                <li><strong>xxhdpi (480 DPI):</strong> Full HD, 3x</li>
                <li><strong>xxxhdpi (640 DPI):</strong> QHD+, 4x (flagship devices)</li>
              </ul>
              <p className="text-[10px] text-gray-600 mt-2 italic">
                Most Android devices today are xhdpi (320 DPI) or higher
              </p>
            </div>
            
            {/* iOS */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
              <p className="font-medium text-xs text-gray-900 mb-2">🍎 iOS Retina Displays</p>
              <ul className="space-y-1 text-[11px] text-gray-700">
                <li><strong>@1x (163 PPI):</strong> Non-Retina (legacy)</li>
                <li><strong>@2x (326 PPI):</strong> Retina - iPhone, iPad (standard)</li>
                <li><strong>@3x (458 PPI):</strong> Super Retina - iPhone Pro models</li>
              </ul>
              <p className="text-[10px] text-gray-600 mt-2 italic">
                Most iPhones use @2x or @3x Retina displays
              </p>
            </div>
          </div>
        </div>

        {/* Quick Reference Card */}
        <div className="bg-gradient-to-r from-purple-50 to-pink-50 border-2 border-purple-300 rounded-lg p-4">
          <h3 className="font-semibold text-sm mb-3 text-gray-900">⚡ Quick Reference</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-xs">
            <div>
              <p className="text-gray-600 font-medium">Most Common:</p>
              <p className="text-gray-900">Android xhdpi (2x)</p>
              <p className="text-gray-900">iOS @2x Retina</p>
            </div>
            <div>
              <p className="text-gray-600 font-medium">Medium (168 DP):</p>
              <p className="text-green-700 font-mono">336px @ xhdpi</p>
              <p className="text-blue-700 font-mono">342px @ @2x</p>
            </div>
            <div>
              <p className="text-gray-600 font-medium">Tall (264 DP):</p>
              <p className="text-green-700 font-mono">528px @ xhdpi</p>
              <p className="text-blue-700 font-mono">538px @ @2x</p>
            </div>
            <div>
              <p className="text-gray-600 font-medium">Max Image:</p>
              <p className="text-gray-900 font-mono">1500x1000px</p>
              <p className="text-gray-600">RCS standard</p>
            </div>
          </div>
        </div>

        {/* Usage Tip */}
        <div className="bg-amber-50 border border-amber-200 rounded-lg p-3">
          <p className="text-xs text-gray-800">
            <strong>💡 Tip:</strong> For best cross-platform results, prepare images at xxhdpi (480 DPI) 
            or @2x Retina resolution. The system will automatically scale down for lower-density devices.
            For a Medium height card (168 DP), use approximately 336-342px height images.
          </p>
        </div>
      </CardContent>
    </Card>
  );
}

