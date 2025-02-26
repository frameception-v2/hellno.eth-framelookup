"use client";

import { useEffect, useCallback, useState, ChangeEvent } from "react";
import sdk, {
  AddFrame,
  SignIn as SignInCore,
  type Context,
} from "@farcaster/frame-sdk";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "~/components/ui/card";

import { config } from "~/components/providers/WagmiProvider";
import { truncateAddress } from "~/lib/truncateAddress";
import { base, optimism } from "wagmi/chains";
import { useSession } from "next-auth/react";
import { createStore } from "mipd";
import { Label } from "~/components/ui/label";
import { PROJECT_TITLE } from "~/lib/constants";
import { formatNumber } from "~/lib/formatNumber";


export default function Frame() {
  const [isSDKLoaded, setIsSDKLoaded] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [searchError, setSearchError] = useState<string | null>(null);

  // Handle search input changes with debounce
  const handleSearchChange = useCallback(
    async (e: ChangeEvent<HTMLInputElement>) => {
      const query = e.target.value;
      setSearchQuery(query);
      
      if (query.length < 2) {
        setSearchResults([]);
        return;
      }

      setIsSearching(true);
      setSearchError(null);
      
      try {
        const response = await fetch(`/api/search?q=${encodeURIComponent(query)}`);
        if (!response.ok) {
          throw new Error('Search request failed');
        }
        
        const data = await response.json();
        setSearchResults(data.result.users);
      } catch (error) {
        setSearchError("Failed to search users");
        console.error(error);
      } finally {
        setIsSearching(false);
      }
    },
    []
  );
  const [context, setContext] = useState<Context.FrameContext>();

  const [added, setAdded] = useState(false);

  const [addFrameResult, setAddFrameResult] = useState("");

  const addFrame = useCallback(async () => {
    try {
      await sdk.actions.addFrame();
    } catch (error) {
      if (error instanceof AddFrame.RejectedByUser) {
        setAddFrameResult(`Not added: ${error.message}`);
      }

      if (error instanceof AddFrame.InvalidDomainManifest) {
        setAddFrameResult(`Not added: ${error.message}`);
      }

      setAddFrameResult(`Error: ${error}`);
    }
  }, []);

  useEffect(() => {
    const load = async () => {
      const context = await sdk.context;
      if (!context) {
        return;
      }

      setContext(context);
      setAdded(context.client.added);

      // If frame isn't already added, prompt user to add it
      if (!context.client.added) {
        addFrame();
      }

      sdk.on("frameAdded", ({ notificationDetails }) => {
        setAdded(true);
      });

      sdk.on("frameAddRejected", ({ reason }) => {
        console.log("frameAddRejected", reason);
      });

      sdk.on("frameRemoved", () => {
        console.log("frameRemoved");
        setAdded(false);
      });

      sdk.on("notificationsEnabled", ({ notificationDetails }) => {
        console.log("notificationsEnabled", notificationDetails);
      });
      sdk.on("notificationsDisabled", () => {
        console.log("notificationsDisabled");
      });

      sdk.on("primaryButtonClicked", () => {
        console.log("primaryButtonClicked");
      });

      console.log("Calling ready");
      sdk.actions.ready({});

      // Set up a MIPD Store, and request Providers.
      const store = createStore();

      // Subscribe to the MIPD Store.
      store.subscribe((providerDetails) => {
        console.log("PROVIDER DETAILS", providerDetails);
        // => [EIP6963ProviderDetail, EIP6963ProviderDetail, ...]
      });
    };
    if (sdk && !isSDKLoaded) {
      console.log("Calling load");
      setIsSDKLoaded(true);
      load();
      return () => {
        sdk.removeAllListeners();
      };
    }
  }, [isSDKLoaded, addFrame]);

  if (!isSDKLoaded) {
    return <div>Loading...</div>;
  }

  return (
    <div
      style={{
        paddingTop: context?.client.safeAreaInsets?.top ?? 0,
        paddingBottom: context?.client.safeAreaInsets?.bottom ?? 0,
        paddingLeft: context?.client.safeAreaInsets?.left ?? 0,
        paddingRight: context?.client.safeAreaInsets?.right ?? 0,
      }}
    >
      <div className="w-full max-w-[600px] mx-auto p-4 sm:p-6">
        <Card className="mb-6 border-2 border-purple-500 dark:border-purple-400 shadow-lg">
          <CardHeader className="bg-gradient-to-r from-purple-500 to-pink-500 text-white dark:from-purple-600 dark:to-pink-600 p-6">
            <CardTitle className="text-2xl font-bold tracking-tight mb-2 text-white">User Search</CardTitle>
            <CardDescription className="text-white text-lg font-medium">
              Search for Farcaster users
            </CardDescription>
          </CardHeader>
          <CardContent className="p-6">
            <div className="space-y-6">
              <input
                type="text"
                value={searchQuery}
                onChange={handleSearchChange}
                placeholder="Search users..."
                className="w-full px-4 py-3 border-2 rounded-lg border-purple-300 dark:border-purple-700
                         focus:outline-none focus:ring-2 focus:ring-purple-500 dark:bg-gray-800
                         text-lg placeholder:text-gray-400"
              />
              
              {isSearching && (
                <div className="text-center text-base text-gray-500 py-2">
                  Searching...
                </div>
              )}

              {searchError && (
                <div className="text-center text-sm text-red-500">
                  {searchError}
                </div>
              )}

              {!isSearching && searchResults.length > 0 && (
                <div className="space-y-4">
                  {searchResults.map((user, index) => (
                    <div 
                      key={user.fid}
                      className="p-4 border-2 border-purple-200 dark:border-purple-800 rounded-lg 
                               hover:bg-purple-50 dark:hover:bg-purple-900/30 
                               flex items-center gap-4 cursor-pointer transition-colors"
                      onClick={() => sdk.actions.viewProfile({ fid: parseInt(user.fid) })}
                    >
                      {user.pfp_url && (
                        <img 
                          src={user.pfp_url} 
                          alt={user.display_name || user.username}
                          className="w-12 h-12 rounded-full border-2 border-purple-300 dark:border-purple-600"
                        />
                      )}
                      <div className="flex-1">
                        <div className="font-bold text-lg text-purple-900 dark:text-purple-100">
                          {user.display_name || user.username}
                        </div>
                        <div className="text-sm text-purple-600 dark:text-purple-400">@{user.username}</div>
                        <div className="flex gap-4 mt-1 text-xs text-gray-500 dark:text-gray-400">
                          <span>{formatNumber(user.follower_count)} followers</span>
                          <span>{formatNumber(user.following_count)} following</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {!isSearching && searchQuery.length >= 2 && searchResults.length === 0 && (
                <div className="text-center text-base text-gray-500 py-4">
                  No users found
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
