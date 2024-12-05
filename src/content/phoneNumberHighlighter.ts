import { findPhoneNumbers, formatPhoneNumber } from '../utils/phoneNumberUtils';

let currentMenu: HTMLElement | null = null;

function handleSelection() {
  const selection = window.getSelection();
  if (!selection || selection.isCollapsed) return;

  const text = selection.toString().trim();
  if (!text) return;

  const phoneNumbers = findPhoneNumbers(text);
  if (phoneNumbers.length === 0) return;

  // Get the selection range coordinates
  const range = selection.getRangeAt(0);
  const rect = range.getBoundingClientRect();

  // Remove existing menu if any
  if (currentMenu) {
    currentMenu.remove();
    currentMenu = null;
  }

  // Create context menu for the first found phone number
  const phone = phoneNumbers[0];
  createPhoneContextMenu(phone, rect);
}

function createPhoneContextMenu(phone: string, rect: DOMRect) {
  currentMenu = document.createElement('div');
  currentMenu.className = 'uconnect-phone-context-menu';
  
  const formattedPhone = formatPhoneNumber(phone);
  console.log("createPhoneContextMenu(  ", phone, " ):", formattedPhone);
  
  currentMenu.innerHTML = `
    <div class="uconnect-phone-number">${formattedPhone}</div>
    <div class="phone-menu-items">
        <button class="menu-item" data-action="call">📞 </button>
        <button class="menu-item" data-action="copy">📋 </button>
        <button class="menu-item" data-action="chat">💬 </button>
    </div>
  `;

  // Position menu below the selection
  currentMenu.style.cssText = `
    left: ${rect.left + window.scrollX}px !important;
    top: ${rect.bottom + window.scrollY + 5}px !important;
  `;

  // Add event listeners for menu items
  currentMenu.addEventListener('click', (e) => {
    const target = e.target as HTMLElement;
    if (!target.classList.contains('menu-item')) return;

    const action = target.getAttribute('data-action');
    if (action === 'call') {
      // Implement call functionality
      console.log('Calling:', phone);
      // TODO: Integrate with telephony system
    } else if (action === 'copy') {
      navigator.clipboard.writeText(phone);
      showToast('Phone number copied to clipboard');
    }

    currentMenu?.remove();
    currentMenu = null;
  });

  document.body.appendChild(currentMenu);
}

function showToast(message: string) {
  const toast = document.createElement('div');
  toast.className = 'uconnect-toast';
  toast.textContent = message;
  document.body.appendChild(toast);

  // Remove toast after animation
  setTimeout(() => {
    toast.remove();
  }, 3000);
}

// Handle clicks outside the menu
function handleClickOutside(e: MouseEvent) {
  if (currentMenu && !(e.target instanceof Node && currentMenu.contains(e.target))) {
    currentMenu.remove();
    currentMenu = null;
  }
}

export function setupPhoneNumberHighlighter() {
  // Listen for text selection
  document.addEventListener('mouseup', handleSelection);
  document.addEventListener('keyup', (e) => {
    if (e.key === 'Escape' && currentMenu) {
      currentMenu.remove();
      currentMenu = null;
    }
  });
  
  // Handle clicks outside the menu
  document.addEventListener('click', handleClickOutside);
}

// Clean up function for removing listeners
export function cleanupPhoneNumberHighlighter() {
  document.removeEventListener('mouseup', handleSelection);
  document.removeEventListener('click', handleClickOutside);
  if (currentMenu) {
    currentMenu.remove();
    currentMenu = null;
  }
}