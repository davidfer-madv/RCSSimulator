import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Action } from "@shared/schema";
import { PlusCircle, Trash2 } from "lucide-react";
import { useState } from "react";

interface SuggestedActionsBuilderProps {
  actions: Action[];
  setActions: (actions: Action[]) => void;
  maxActions?: number;
}

export function SuggestedActionsBuilder({
  actions,
  setActions,
  maxActions = 4,
}: SuggestedActionsBuilderProps) {
  const [actionType, setActionType] = useState<Action["type"]>("url");
  const [actionText, setActionText] = useState("");
  const [url, setUrl] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [eventTitle, setEventTitle] = useState("");
  const [eventDescription, setEventDescription] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [latitude, setLatitude] = useState("");
  const [longitude, setLongitude] = useState("");
  const [locationLabel, setLocationLabel] = useState("");
  const [postbackData, setPostbackData] = useState("");
  const [packageName, setPackageName] = useState("");
  const [appData, setAppData] = useState("");
  const [walletPassUrl, setWalletPassUrl] = useState("");
  const [mapsQuery, setMapsQuery] = useState("");
  const [mapsLatitude, setMapsLatitude] = useState("");
  const [mapsLongitude, setMapsLongitude] = useState("");

  const resetForm = () => {
    setActionText("");
    setUrl("");
    setPhoneNumber("");
    setEventTitle("");
    setEventDescription("");
    setStartTime("");
    setEndTime("");
    setLatitude("");
    setLongitude("");
    setLocationLabel("");
    setPostbackData("");
    setPackageName("");
    setAppData("");
    setWalletPassUrl("");
    setMapsQuery("");
    setMapsLatitude("");
    setMapsLongitude("");
  };

  const addAction = () => {
    if (!actionText || actionText.length > 25) return;

    let newAction: Action | null = null;

    switch (actionType) {
      case "url":
        if (!url) return;
        newAction = {
          type: "url",
          text: actionText,
          url,
          postbackData: postbackData || undefined,
        };
        break;
      case "dial":
        if (!phoneNumber) return;
        newAction = {
          type: "dial",
          text: actionText,
          phoneNumber,
          postbackData: postbackData || undefined,
        };
        break;
      case "calendar":
        if (!eventTitle || !startTime || !endTime) return;
        newAction = {
          type: "calendar",
          text: actionText,
          title: eventTitle,
          description: eventDescription || undefined,
          startTime,
          endTime,
          postbackData: postbackData || undefined,
        };
        break;
      case "viewLocation":
        if (!latitude || !longitude) return;
        newAction = {
          type: "viewLocation",
          text: actionText,
          latitude: parseFloat(latitude),
          longitude: parseFloat(longitude),
          label: locationLabel || undefined,
          postbackData: postbackData || undefined,
        };
        break;
      case "shareLocation":
        newAction = {
          type: "shareLocation",
          text: actionText,
          postbackData: postbackData || undefined,
        };
        break;
      case "openApp":
        if (!packageName) return;
        newAction = {
          type: "openApp",
          text: actionText,
          packageName,
          appData: appData || undefined,
          postbackData: postbackData || undefined,
        };
        break;
      case "wallet":
        if (!walletPassUrl) return;
        newAction = {
          type: "wallet",
          text: actionText,
          walletPassUrl,
          postbackData: postbackData || undefined,
        };
        break;
      case "maps":
        if (!mapsQuery) return;
        newAction = {
          type: "maps",
          text: actionText,
          query: mapsQuery,
          latitude: mapsLatitude ? parseFloat(mapsLatitude) : undefined,
          longitude: mapsLongitude ? parseFloat(mapsLongitude) : undefined,
          postbackData: postbackData || undefined,
        };
        break;
    }

    if (newAction) {
      setActions([...actions, newAction]);
      resetForm();
    }
  };

  const removeAction = (index: number) => {
    const newActions = [...actions];
    newActions.splice(index, 1);
    setActions(newActions);
  };

  const actionTextExceeded = actionText.length > 25;

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <Label className="block">Suggested Actions</Label>
        <Badge variant="outline" className="ml-2">
          {actions.length} of {maxActions} max
        </Badge>
      </div>

      {/* Display existing actions */}
      <div className="space-y-2">
        {actions.map((action, index) => (
          <div key={index} className="flex items-center gap-2 p-2 border rounded-md">
            <div className="flex-1">
              <div className="font-medium text-sm">{action.text}</div>
              <div className="text-xs text-gray-500">
                {action.type === "url" && `URL: ${action.url}`}
                {action.type === "dial" && `Phone: ${action.phoneNumber}`}
                {action.type === "calendar" && `Calendar: ${action.title}`}
                {action.type === "viewLocation" && `Location: ${action.latitude}, ${action.longitude}`}
                {action.type === "shareLocation" && "Share Location"}
                {action.type === "openApp" && `App: ${action.packageName}`}
                {action.type === "wallet" && `Wallet: ${action.walletPassUrl}`}
                {action.type === "maps" && `Maps: ${action.query}`}
              </div>
            </div>
            <Badge variant="secondary" className="text-xs">
              {action.type}
            </Badge>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => removeAction(index)}
              className="h-8 w-8 p-0"
              data-testid={`button-remove-action-${index}`}
            >
              <Trash2 className="h-4 w-4 text-red-500" />
            </Button>
          </div>
        ))}
      </div>

      {/* Add new action form */}
      {actions.length < maxActions && (
        <div className="space-y-3 border-t pt-4">
          <div className="grid grid-cols-2 gap-3">
            <div className="col-span-2 sm:col-span-1">
              <Label htmlFor="action-text">Button Text</Label>
              <Input
                id="action-text"
                value={actionText}
                onChange={(e) => setActionText(e.target.value)}
                placeholder="Shop now"
                maxLength={25}
                className={actionTextExceeded ? "border-red-500" : ""}
                data-testid="input-action-text"
              />
              <div className="flex justify-between mt-1">
                <span className={`text-xs ${actionTextExceeded ? 'text-red-500' : 'text-gray-500'}`}>
                  {actionText.length}/25 characters
                </span>
              </div>
            </div>

            <div className="col-span-2 sm:col-span-1">
              <Label htmlFor="action-type">Action Type</Label>
              <Select value={actionType} onValueChange={(value) => setActionType(value as Action["type"])}>
                <SelectTrigger id="action-type" data-testid="select-action-type">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="url">Open URL</SelectItem>
                  <SelectItem value="dial">Dial Phone</SelectItem>
                  <SelectItem value="calendar">Add to Calendar</SelectItem>
                  <SelectItem value="viewLocation">View Location</SelectItem>
                  <SelectItem value="shareLocation">Share Location</SelectItem>
                  <SelectItem value="openApp">Open App</SelectItem>
                  <SelectItem value="wallet">Add to Wallet</SelectItem>
                  <SelectItem value="maps">Open Maps</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Conditional fields based on action type */}
          {actionType === "url" && (
            <div>
              <Label htmlFor="url">URL</Label>
              <Input
                id="url"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="https://example.com"
                type="url"
                data-testid="input-url"
              />
            </div>
          )}

          {actionType === "dial" && (
            <div>
              <Label htmlFor="phone">Phone Number</Label>
              <Input
                id="phone"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                placeholder="+1234567890"
                data-testid="input-phone"
              />
            </div>
          )}

          {actionType === "calendar" && (
            <div className="space-y-3">
              <div>
                <Label htmlFor="event-title">Event Title</Label>
                <Input
                  id="event-title"
                  value={eventTitle}
                  onChange={(e) => setEventTitle(e.target.value)}
                  placeholder="Meeting with team"
                  data-testid="input-event-title"
                />
              </div>
              <div>
                <Label htmlFor="event-description">Event Description (Optional)</Label>
                <Textarea
                  id="event-description"
                  value={eventDescription}
                  onChange={(e) => setEventDescription(e.target.value)}
                  placeholder="Discuss project updates"
                  rows={2}
                  data-testid="input-event-description"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label htmlFor="start-time">Start Time</Label>
                  <Input
                    id="start-time"
                    type="datetime-local"
                    value={startTime}
                    onChange={(e) => setStartTime(e.target.value)}
                    data-testid="input-start-time"
                  />
                </div>
                <div>
                  <Label htmlFor="end-time">End Time</Label>
                  <Input
                    id="end-time"
                    type="datetime-local"
                    value={endTime}
                    onChange={(e) => setEndTime(e.target.value)}
                    data-testid="input-end-time"
                  />
                </div>
              </div>
            </div>
          )}

          {actionType === "viewLocation" && (
            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label htmlFor="latitude">Latitude</Label>
                  <Input
                    id="latitude"
                    type="number"
                    step="any"
                    value={latitude}
                    onChange={(e) => setLatitude(e.target.value)}
                    placeholder="37.7749"
                    data-testid="input-latitude"
                  />
                </div>
                <div>
                  <Label htmlFor="longitude">Longitude</Label>
                  <Input
                    id="longitude"
                    type="number"
                    step="any"
                    value={longitude}
                    onChange={(e) => setLongitude(e.target.value)}
                    placeholder="-122.4194"
                    data-testid="input-longitude"
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="location-label">Location Label (Optional)</Label>
                <Input
                  id="location-label"
                  value={locationLabel}
                  onChange={(e) => setLocationLabel(e.target.value)}
                  placeholder="Our Store"
                  data-testid="input-location-label"
                />
              </div>
            </div>
          )}

          {actionType === "shareLocation" && (
            <div className="p-3 bg-blue-50 rounded-md">
              <p className="text-sm text-blue-800">
                This action allows users to share their current location with you.
              </p>
            </div>
          )}

          {actionType === "openApp" && (
            <div className="space-y-3">
              <div>
                <Label htmlFor="package-name">App Package Name</Label>
                <Input
                  id="package-name"
                  value={packageName}
                  onChange={(e) => setPackageName(e.target.value)}
                  placeholder="com.example.app"
                  data-testid="input-package-name"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Android package name (e.g., com.example.myapp)
                </p>
              </div>
              <div>
                <Label htmlFor="app-data">App Data (Optional)</Label>
                <Textarea
                  id="app-data"
                  value={appData}
                  onChange={(e) => setAppData(e.target.value)}
                  placeholder="Additional data to pass to the app"
                  rows={2}
                  data-testid="input-app-data"
                />
              </div>
            </div>
          )}

          {actionType === "wallet" && (
            <div>
              <Label htmlFor="wallet-pass-url">Wallet Pass URL</Label>
              <Input
                id="wallet-pass-url"
                type="url"
                value={walletPassUrl}
                onChange={(e) => setWalletPassUrl(e.target.value)}
                placeholder="https://example.com/pass.pkpass"
                data-testid="input-wallet-pass-url"
              />
              <p className="text-xs text-gray-500 mt-1">
                URL to Google Wallet pass or Apple Wallet pass
              </p>
            </div>
          )}

          {actionType === "maps" && (
            <div className="space-y-3">
              <div>
                <Label htmlFor="maps-query">Location or Query</Label>
                <Input
                  id="maps-query"
                  value={mapsQuery}
                  onChange={(e) => setMapsQuery(e.target.value)}
                  placeholder="123 Main St, City or Business Name"
                  data-testid="input-maps-query"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Address, business name, or search query
                </p>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label htmlFor="maps-latitude">Latitude (Optional)</Label>
                  <Input
                    id="maps-latitude"
                    type="number"
                    step="any"
                    value={mapsLatitude}
                    onChange={(e) => setMapsLatitude(e.target.value)}
                    placeholder="37.7749"
                    data-testid="input-maps-latitude"
                  />
                </div>
                <div>
                  <Label htmlFor="maps-longitude">Longitude (Optional)</Label>
                  <Input
                    id="maps-longitude"
                    type="number"
                    step="any"
                    value={mapsLongitude}
                    onChange={(e) => setMapsLongitude(e.target.value)}
                    placeholder="-122.4194"
                    data-testid="input-maps-longitude"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Optional postback data for all action types */}
          <div>
            <Label htmlFor="postback">Postback Data (Optional)</Label>
            <Input
              id="postback"
              value={postbackData}
              onChange={(e) => setPostbackData(e.target.value)}
              placeholder="action_id_123"
              maxLength={2048}
              data-testid="input-postback"
            />
            <p className="text-xs text-gray-500 mt-1">
              Data sent back to your server when user taps this action
            </p>
          </div>

          <Button
            type="button"
            onClick={addAction}
            disabled={!actionText || actionTextExceeded}
            className="w-full"
            data-testid="button-add-action"
          >
            <PlusCircle className="mr-2 h-4 w-4" />
            Add Action
          </Button>
        </div>
      )}
    </div>
  );
}
