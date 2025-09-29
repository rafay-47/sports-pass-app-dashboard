import React, { useState, useCallback, useRef } from 'react';
import { Wrapper, Status } from '@googlemaps/react-wrapper';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { MapPin, Loader2, Search, Navigation } from 'lucide-react';

// Declare google maps types
declare global {
  interface Window {
    google: typeof google;
  }
}

interface GoogleMapProps {
  apiKey: string;
  center?: google.maps.LatLngLiteral;
  zoom?: number;
  onLocationSelect?: (location: google.maps.LatLngLiteral) => void;
  selectedLocation?: google.maps.LatLngLiteral;
  className?: string;
  onMapReady?: (map: google.maps.Map) => void;
}

const MapComponent: React.FC<GoogleMapProps> = ({
  center = { lat: 24.8607, lng: 67.0011 }, // Default to Karachi
  zoom = 12,
  onLocationSelect,
  selectedLocation,
  className = "w-full h-96",
  apiKey,
  onMapReady
}) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const googleMapRef = useRef<google.maps.Map | null>(null);
  const markerRef = useRef<google.maps.Marker | null>(null);

  React.useEffect(() => {
    if (!mapRef.current || !window.google) return;

    // Initialize map
    googleMapRef.current = new window.google.maps.Map(mapRef.current, {
      center,
      zoom,
      mapTypeControl: true,
      streetViewControl: true,
      fullscreenControl: true,
    });

    // Call onMapReady callback if provided
    if (onMapReady && googleMapRef.current) {
      onMapReady(googleMapRef.current);
    }

    // Add click listener
    if (onLocationSelect) {
      googleMapRef.current.addListener('click', (event: google.maps.MapMouseEvent) => {
        if (event.latLng) {
          const location = {
            lat: event.latLng.lat(),
            lng: event.latLng.lng()
          };
          onLocationSelect(location);
        }
      });
    }

    return () => {
      if (googleMapRef.current) {
        window.google.maps.event.clearInstanceListeners(googleMapRef.current);
      }
    };
  }, [center, zoom, onLocationSelect, onMapReady]);

  // Update marker when selectedLocation changes
  React.useEffect(() => {
    if (!googleMapRef.current || !selectedLocation) return;

    // Remove existing marker
    if (markerRef.current) {
      markerRef.current.setMap(null);
    }

    // Create new marker
    markerRef.current = new window.google.maps.Marker({
      position: selectedLocation,
      map: googleMapRef.current,
      title: 'Selected Location',
      animation: window.google.maps.Animation.DROP,
    });

    // Center map on selected location
    googleMapRef.current.setCenter(selectedLocation);
  }, [selectedLocation]);

  return <div ref={mapRef} className={className} />;
};

const LoadingComponent: React.FC = () => (
  <div className="w-full h-96 bg-muted rounded-lg flex items-center justify-center">
    <div className="flex items-center gap-2">
      <Loader2 className="w-6 h-6 animate-spin" />
      <span>Loading map...</span>
    </div>
  </div>
);

const ErrorComponent: React.FC<{ status: Status }> = ({ status }) => (
  <div className="w-full h-96 bg-destructive/10 border border-destructive/20 rounded-lg flex items-center justify-center">
    <div className="text-center">
      <MapPin className="w-12 h-12 text-destructive mx-auto mb-2" />
      <p className="text-destructive font-medium">Failed to load map</p>
      <p className="text-sm text-muted-foreground">Status: {status}</p>
      <p className="text-sm text-muted-foreground mt-2">
        Please check your Google Maps API key
      </p>
    </div>
  </div>
);

interface LocationPickerProps {
  onLocationSelect: (location: google.maps.LatLngLiteral) => void;
  selectedLocation?: google.maps.LatLngLiteral;
  apiKey?: string;
}

export const LocationPicker: React.FC<LocationPickerProps> = ({
  onLocationSelect,
  selectedLocation,
  apiKey
}) => {
  const [currentLocation, setCurrentLocation] = useState<google.maps.LatLngLiteral | undefined>(selectedLocation);
  const [searchQuery, setSearchQuery] = useState('');
  const placesServiceRef = useRef<google.maps.places.PlacesService | null>(null);

  const handleLocationSelect = useCallback((location: google.maps.LatLngLiteral) => {
    setCurrentLocation(location);
    onLocationSelect(location);
  }, [onLocationSelect]);

  const handleSearch = useCallback(() => {
    if (!searchQuery.trim() || !placesServiceRef.current) return;

    const request = {
      query: searchQuery,
      fields: ['name', 'geometry', 'formatted_address']
    };

    placesServiceRef.current.findPlaceFromQuery(request, (results, status) => {
      if (status === google.maps.places.PlacesServiceStatus.OK && results && results[0]) {
        const place = results[0];
        if (place.geometry?.location) {
          const location = {
            lat: place.geometry.location.lat(),
            lng: place.geometry.location.lng()
          };
          handleLocationSelect(location);
        }
      }
    });
  }, [searchQuery, handleLocationSelect]);

  const handleGetCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const location = {
            lat: position.coords.latitude,
            lng: position.coords.longitude
          };
          handleLocationSelect(location);
        },
        (error) => {
          console.error('Error getting current location:', error);
          // Fallback to Karachi coordinates
          handleLocationSelect({ lat: 24.8607, lng: 67.0011 });
        }
      );
    }
  };

  const renderMap = (status: Status) => {
    switch (status) {
      case Status.LOADING:
        return <LoadingComponent />;
      case Status.FAILURE:
        return <ErrorComponent status={status} />;
      case Status.SUCCESS:
        return (
          <MapComponent
            apiKey={apiKey || ''}
            center={currentLocation || { lat: 24.8607, lng: 67.0011 }}
            zoom={12}
            onLocationSelect={handleLocationSelect}
            selectedLocation={currentLocation}
            onMapReady={(map) => {
              // Initialize Places service when map is ready
              placesServiceRef.current = new google.maps.places.PlacesService(map);
            }}
          />
        );
    }
  };

  if (!apiKey) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MapPin className="w-5 h-5" />
            Location Selection
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="w-full h-96 bg-muted rounded-lg flex items-center justify-center">
            <div className="text-center">
              <MapPin className="w-12 h-12 text-muted-foreground mx-auto mb-2" />
              <p className="text-muted-foreground font-medium">Google Maps API Key Required</p>
              <p className="text-sm text-muted-foreground mt-2">
                Please add NEXT_PUBLIC_GOOGLE_MAPS_API_KEY to your .env file
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MapPin className="w-5 h-5" />
          Location Selection
        </CardTitle>
        <div className="flex items-center gap-2">
          <div className="flex-1">
            <Input
              placeholder="Search for a location..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
            />
          </div>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={handleSearch}
            disabled={!searchQuery.trim()}
          >
            <Search className="w-4 h-4" />
          </Button>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={handleGetCurrentLocation}
          >
            <Navigation className="w-4 h-4" />
          </Button>
        </div>
        <p className="text-sm text-muted-foreground">
          Search for a location or click on the map to select your club location
        </p>
      </CardHeader>
      <CardContent>
        <Wrapper
          apiKey={apiKey || ''}
          render={renderMap}
          libraries={['places']}
        />
        {currentLocation && (
          <div className="mt-4 p-3 bg-muted rounded-lg">
            <p className="text-sm font-medium">Selected Location:</p>
            <p className="text-sm text-muted-foreground">
              Latitude: {currentLocation.lat.toFixed(6)}, Longitude: {currentLocation.lng.toFixed(6)}
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default LocationPicker;
