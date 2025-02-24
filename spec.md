
## Minimal Implementation Spec
Create a focused spec addressing the core user need.
We have an existing Farcaster miniapp (Frame v2) template to work with.
We need to customize the template in form and function to meet the user requirements.

### Output Format
1. Core Functionality
   - Main user flow
   - Required API endpoints
   - Key data structures

2. Implementation Approach
   - Frame structure (screens/actions)
   - External API integration points
   - State management approach

3. Technical Considerations
   - API authentication needs
   - Critical error scenarios

### API Context
Farcaster is a decentralized social network built on Ethereum, emphasizing user data ownership and interoperability. Each user connects their Ethereum wallet, ensuring secure identity verification and seamless integration with blockchain-based applications. ￼

Developers can leverage Farcaster’s open protocol to create innovative applications. The platform offers various tools and APIs to facilitate this process. For instance, the Farcaster-py SDK allows developers to programmatically interact with the Farcaster network using Python, enabling tasks such as posting messages, retrieving user information, and more. ￼

Additionally, Farcaster supports the development of “frames,” which are mini-apps that run inside a Farcaster feed. These frames enable rich, interactive experiences without requiring users to leave their social feed. Frameworks like Frog have been developed to simplify the creation of these frames, providing a minimal footprint and utilities for common tasks. ￼

Farcaster’s architecture includes Hubs, which are distributed servers that store and validate data. Developers can run their own Hubs to gain real-time access to Farcaster data, enhancing the decentralization and resilience of the network. ￼

The platform’s integration with blockchain technology ensures that user data is secure and tamper-proof. By leveraging Ethereum’s capabilities, Farcaster provides a censorship-resistant environment where users maintain control over their social interactions. ￼

For more detailed information on building with Farcaster, including tutorials and API documentation, developers can refer to the official Farcaster documentation.￼https://docs.farcaster.xyz/developers/

"Confirming..." : isConfirmed ? "Confirmed!" : "Pending"}</div>
            </div>
          )}
          <Button onClick={sign} disabled={isSignPending}>
            Sign Message
          </Button>
          {isSignError && <div className="text-red-500 text-xs mt-1">{signError.message}</div>}
          <Button onClick={signTyped} disabled={isSignTypedPending}>
            Sign Typed Data
          </Button>
          {isSignTypedError && <div className="text-red-500 text-xs mt-1">{signTypedError.message}</div>}
        </>
      )}
    </div>
  );
}

Interactions

SDK Readiness

Upon initialization, the application signals to the Farcaster parent app that the frame is ready by invoking sdk.actions.ready(). This action transitions the frame from the splash screen to the main content.

useEffect(() => {
  const initializeSDK = async () => {
    setContext(await sdk.context);
    sdk.actions.ready();
    setIsSDKLoaded(true);
  };
  if (sdk && !isSDKLoaded) {
    initializeSDK();
  }
}, [isSDKLoaded]);

Context Management

The Frame SDK provides contextual data about the current user and environment through sdk.context. This data is asynchronously fetched and managed within the component state, allowing for dynamic rendering based on the user’s context.

const [context, setContext] = useState<FrameContext>();

useEffect(() => {
  const fetchContext = async () => {
    const ctx = await sdk.context;
    setContext(ctx);
    sdk.actions.ready();
  };
  fetchContext();
}, []);

Action Invocation

Interactive elements such as buttons utilize Frame SDK actions to perform operations like opening external URLs or closing the frame. These actions communicate directly with the Farcaster client to execute desired behaviors.

const openUrl = useCallback(() => {
  sdk.actions.openUrl("https://www.example.com");
}, []);

const closeFrame = useCallback(() => {
  sdk.actions.close();
}, []);

Wallet Operations

Leveraging Wagmi, the application manages wallet connections, displays user addresses, and handles transactions and signatures. Hooks provided by Wagmi facilitate these interactions, ensuring a responsive and secure wallet experience.
	•	Connecting/Disconnecting:

<Button onClick={() => (isConnected ? disconnect() : connect({ connector: config.connectors[0] }))}>
  {isConnected ? "Disconnect" : "Connect"}
</Button>


	•	Sending Transactions:

const sendTx = useCallback(() => {
  sendTransaction(
    {
      to: "0xRecipientAddress",
      data: "0xTransactionData",
    },
    {
      onSuccess: (hash) => {
        setTxHash(hash);
      },
    }
  );
}, [sendTransaction]);


	•	Signing Messages:

const sign = useCallback(() => {
  signMessage({ message: "Hello from Frames v2!" });
}, [signMessage]);



Signature Handling

The application supports both simple message signing and typed data signing, enabling users to authenticate or authorize actions securely.
	•	Sign Message:

const sign = useCallback(() => {
  signMessage({ message: "Hello from Frames v2!" });
}, [signMessage]);


	•	Sign Typed Data:

const signTyped = useCallback(() => {
  signTypedData({
    domain: { name: "Frames v2 Demo", version: "1", chainId: 8453 },
    types: { Message: [{ name: "content", type: "string" }] },
    message: { content: "Hello from Frames v2!" },
    primaryType: "Message",
  });
}, [signTypedData]);

# Search for casts on Farcaster via Neynar API

https://api.neynar.com/v2/farcaster/cast/search
Search for casts based on a query string, with optional AND filters

Searching Casts
You can search for casts using keywords and commands in the search query. The following search commands are supported:

Date Range Commands
before:YYYY-MM-DD - Find casts created before the specified date
after:YYYY-MM-DD - Find casts created after the specified date
For example:

star wars before:2023-01-01 - Find Star Wars-related casts from before 2023
blockchain after:2023-06-01 - Find blockchain-related casts from after June 2023
Query Params
q
string
required
Query string to search for casts. Include 'before:YYYY-MM-DD' or 'after:YYYY-MM-DD' to search for casts before or after a specific date.

author_fid
int32
Fid of the user whose casts you want to search

viewer_fid
int32
Providing this will return search results that respects this user's mutes and blocks and includes viewer_context.

parent_url
string
Parent URL of the casts you want to search

channel_id
string
Channel ID of the casts you want to search

priority_mode
boolean
Defaults to false
When true, only returns search results from power badge users and users that the viewer follows (if viewer_fid is provided).

false
limit
int32
1 to 100
Defaults to 25
Number of results to fetch

25
cursor
string
Pagination cursor

const url = 'https://api.neynar.com/v2/farcaster/cast/search?priority_mode=false&limit=25';
const options = {
method: 'GET',
headers: {accept: 'application/json', 'x-api-key': 'NEYNAR_API_DOCS'}
};

fetch(url, options)
.then(res => res.json())
.then(json => console.log(json))
.catch(err => console.error(err));

Response:
{ "result": { "casts": [ { "hash": "string", "parent_hash": "string", "parent_url": "string", "root_parent_url": "string", "parent_author": { "fid": 0 }, "author": { "object": "user", "fid": 3, "username": "string", "display_name": "string", "custody_address": "string", "pfp_url": "string", "profile": { "bio": { "text": "string", "mentioned_profiles": [ "string" ] }, "location": { "latitude": 0, "longitude": 0, "address": { "city": "string", "state": "string", "state_code": "string", "country": "string", "country_code": "string" } } }, "follower_count": 0, "following_count": 0, "verifications": [ "string" ], "verified_addresses": { "eth_addresses": [ "string" ], "sol_addresses": [ "string" ] }, "verified_accounts": [ { "platform": "x", "username": "string" } ], "power_badge": true, "experimental": { "neynar_user_score": 0 }, "viewer_context": { "following": true, "followed_by": true, "blocking": true, "blocked_by": true } }, "text": "string", "timestamp": "2025-02-14T18:58:33.704Z", "embeds": [ { "url": "string", "metadata": { "\_status": "string", "content_type": "string", "content_length": 0, "image": { "height_px": 0, "width_px": 0 }, "video": { "duration_s": 0, "stream": [ { "codec_name": "string", "height_px": 0, "width_px": 0 } ] }, "html": { "favicon": "string", "modifiedTime": "string", "ogArticleAuthor": "string", "ogArticleExpirationTime": "string", "ogArticleModifiedTime": "string", "ogArticlePublishedTime": "string", "ogArticlePublisher": "string", "ogArticleSection": "string", "ogArticleTag": "string", "ogAudio": "string", "ogAudioSecureURL": "string", "ogAudioType": "string", "ogAudioURL": "string", "ogAvailability": "string", "ogDate": "string", "ogDescription": "string", "ogDeterminer": "string", "ogEpisode": "string", "ogImage": [ { "height": "string",

### User Prompt
create a simple user search input box where I can type in a farcaster user and when I click on them the Frame sdk profile view comes up
