#### Setup
- [ ] Task 1: Create basic component structure with search input  
  - **Implementation Plan Step 1**  
  - Build: Initialize UserSearchFrame component with query state and input field  
  - Outcome: Typing in input updates query state (verify with console.log)

#### Core Features
- [ ] Task 4: Display basic search results list  
  - Depends on: Task 2  
  - **Implementation Plan Step 6**  
  - Build: Render results array with username/display name  
  - Outcome: Typing shows text-only results matching API response  
- [ ] Task 5: Create loading state handling  
  - Depends on: Task 2  
  - **Implementation Plan Step 4**  
  - Build: Add isLoading state to show/hide "Searching..." text  
  - Outcome: Loading indicator appears during API requests  
- [ ] Task 6: Implement profile viewer click handler  
  - Depends on: Task 4  
  - **Implementation Plan Step 5**  
  - Build: Add onClick to trigger profile viewer with fid  
  - Outcome: Clicking a result opens profile viewer (test with hardcoded fid)  
- [ ] Task 7: Add error handling for empty states  
  - Depends on: Task 4  
  - **Implementation Plan Step 7**  
  - Build: Show "No users found" when results are empty  
  - Outcome: Invalid searches display empty state message  

#### API Integration
- [ ] Task 2: Implement API search integration  
  - Depends on: Task 1  
  - **Implementation Plan Step 2**  
  - Build: Fetch Neynar API results via useEffect  
  - Outcome: Searching "test" logs API results in console  
- [ ] Task 3: Add debounced API requests  
  - Depends on: Task 2  
  - **Implementation Plan Step 3**  
  - Build: Add 300ms debounce to reduce API calls  
  - Outcome: API requests only fire after typing pauses  
- [ ] Task 8: Add API error handling  
  - Depends on: Task 2  
  - **Implementation Plan Step 9**  
  - Build: Catch API errors and show "Search unavailable"  
  - Outcome: Network errors display error state  

#### UI/UX
- [ ] Task 9: Implement profile image display  
  - Depends on: Task 4  
  - **Implementation Plan Step 8**  
  - Build: Add <img> tags with user.pfp_url  
  - Outcome: Profile images appear next to usernames  
- [ ] Task 10: Style responsive layout  
  - Depends on: Task 9  
  - **Implementation Plan Step 10**  
  - Build: Add CSS for 600x600px container and scrollable results  
  - Outcome: Frame maintains dimensions and scrolls on mobile  

---

### Implementation Sequence  
1. **Setup** (Task 1)  
2. **API Integration** (Tasks 2 → 3 → 8)  
3. **Core Features** (Tasks 4 → 5 → 6 → 7)  
4. **UI/UX** (Tasks 9 → 10)  

**Why This Order?**  
- Start with component scaffolding (Task 1)  
- Prioritize API integration (Tasks 2-3) to enable real data flow  
- Build visible features next (Tasks 4-7) for user feedback  
- Polish UI last (Tasks 9-10) after core functionality works