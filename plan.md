### Step 1: Create basic component structure with search input
```text
- Build: Initialize UserSearchFrame component with query state and input field
- Outcome: Typing in input updates query state (verify with console.log)
```

### Step 2: Implement API search integration
```text
- Build: Add useEffect that calls Neynar API with query, store results in state
- Outcome: Searching "test" shows real API results in console (without UI)
```

### Step 3: Add debounced API requests
```text
- Build: Implement 300ms debounce in useEffect with clearTimeout
- Outcome: Network tab shows API calls only happen after typing pause
```

### Step 4: Create loading state handling
```text
- Build: Add isLoading state with setter in API call flow
- Outcome: Loading state shows/hides "Searching..." text during API requests
```

### Step 5: Implement profile viewer click handler
```text
- Build: Add onClick to user results that triggers sdk.actions.viewerProfile(fid)
- Outcome: Clicking mock result (hardcoded fid) opens profile viewer in frame
```

### Step 6: Display basic search results list
```text
- Build: Render results array with username/display name and empty image containers
- Outcome: Typing query shows text-only results list matching API response
```

### Step 7: Add error handling for empty states
```text
- Build: Show "No users found" when results are empty after successful search
- Outcome: Searching invalid term shows empty state message
```

### Step 8: Implement profile image display
```text
- Build: Add <img> tags with user.pfp_url and basic styling
- Outcome: Profile images appear next to usernames in search results
```

### Step 9: Add API error handling
```text
- Build: Catch API errors and show "Search unavailable" message
- Outcome: Simulated API failure (e.g. bad key) shows error state
```

### Step 10: Style responsive layout
```text
- Build: Add CSS for 600x600px container, scrollable results, image sizing
- Outcome: Frame maintains proper dimensions and scrolls overflow on mobile
```