<script lang="ts">
    import { settingsStore, type Settings } from "../stores/settingsStore";
    import { MessageTypes } from "../utils/messageTypes";

    let settings: Settings;
    
    // Subscribe to the settings store
    settingsStore.subscribe(value => {
        settings = value;
    });

    let sessionValid = false;
    let showConnectBtn = false;
    let sessionMessage = "";
    const checkIcon = "✔️";
    const crossIcon = "❌";
    const importantIcon = "❗";

    // Settings options
    const languages = ["English", "French", "Spanish"];
    const appearanceOptions = ["Follow system", "Light", "Dark"];
    const textSizeOptions = ["Normal", "Large"];
    const sidebarPositions = ["Top Right", "Top Left"];

    function saveSettings() {
        settingsStore.set(settings);
        console.log("Settings saved:", settings);
    }

    // Check if running in a Chrome extension context
    function isChromeBrowserExtensionContext() {
        return true;
        /*return typeof chrome !== 'undefined' 
            && chrome.runtime 
            && chrome.tabs;
            */
    }

    // Safely request domain permission
    async function requestDomainPermission(url: string): Promise<boolean> {
        return new Promise((resolve) => {
            if (!isChromeBrowserExtensionContext()) {
                console.warn('Cannot request permissions outside Chrome extension');
                resolve(false);
                return;
            }

            chrome.runtime.sendMessage(
                { 
                    type: 'REQUEST_ORIGIN_PERMISSION', 
                    url: url 
                },
                (response) => {
                    resolve(response.granted);
                }
            );
        });
    }

    // Check telephony server session
    async function checkTelephonyServerSession(url: string): Promise<boolean> {
        return new Promise((resolve) => {
            if (!isChromeBrowserExtensionContext()) {
                console.warn('Cannot check cookies outside Chrome extension');
                resolve(false);
                return;
            }

            chrome.runtime.sendMessage(
                { 
                    type: MessageTypes.CHECK_COOKIE, 
                    url: url, 
                    cookieName: "myIstra_SESSIONID"
                },
                (response) => {
                    resolve(response.exists);
                }
            );
        });
    }

    // Handle session check
    async function handleCheckSession() {
        const serverURL = settings.telephonyServer.trim();
        if (!serverURL) {
            sessionValid = false;
            sessionMessage = "";
            return;
        }

        try {
            // Check Chrome extension context
            if (!isChromeBrowserExtensionContext()) {
                throw new Error('Not in a Chrome extension context');
            }

            // Request domain permission
            const granted = await requestDomainPermission(serverURL);

            if (granted) {
                console.log(`Permission granted/checked for ${serverURL}`);
                
                // Check session
                const sessionExists = await checkTelephonyServerSession(serverURL);
                
                if (sessionExists) {
                    sessionValid = true;
                    sessionMessage = `${checkIcon} Session valid`;
                    showConnectBtn = false;
                } else {
                    sessionValid = false;
                    sessionMessage = `${crossIcon} Invalid session: connect manually`;
                    showConnectBtn = true;
                }
            } else {
                console.error(`Permission denied for ${serverURL}`);
                sessionValid = false;
                sessionMessage = `${importantIcon} Permission denied: connect manually`;
                showConnectBtn = true;
            }
        } catch (error: unknown) {
            // Robust error handling
            let errorMessage = 'Unknown error';
            if (error instanceof Error) {
                errorMessage = error.message;
            } else if (typeof error === 'string') {
                errorMessage = error;
            }

            console.error('Session check error:', error);
            sessionMessage = `${crossIcon} Error checking session: ${errorMessage}`;
            sessionValid = false;
            showConnectBtn = true;
        }
    }

    // Connect to telephony server
    function connect() {
        const url = settings.telephonyServer.trim();
        if (url && isChromeBrowserExtensionContext()) {
            chrome.tabs.create({ url });
        } else {
            alert("Please enter a valid server URL or check extension context.");
        }
    }

    // Reactive statement to trigger session check when telephony server changes
    $: if (settings.telephonyServer) {
        handleCheckSession();
    }
</script>

<form class="settings-form">
    <div class="form-group">
        <label for="telserver">Telephony server</label>
        <div class="server-input-group">
            <input
                type="text"
                id="telserver"
                bind:value={settings.telephonyServer}
                placeholder="e.g., https://myistra.enreach.connect.net"
            />
            {#if settings.telephonyServer.trim()}
                {#if showConnectBtn}
                    <button
                        type="button"
                        class="connect-btn"
                        on:click={connect}
                    >
                        Connect
                    </button>
                {:else}
                    <button
                        type="button"
                        class="check-btn"
                        on:click={handleCheckSession}
                    >
                        Check
                    </button>
                {/if}
            {/if}
        </div>
        <small class="session-message">{sessionMessage}</small>
    </div>

    <div class="form-group">
        <label for="crmurl">CRM sync</label>
        <input
            type="text"
            id="crmurl"
            bind:value={settings.crmURL}
            placeholder="e.g., https://login.salesforce.com/"
        />
    </div>

    <div class="form-group">
        <label for="calendarurl">Calendar sync</label>
        <input
            type="text"
            id="calendarurl"
            bind:value={settings.calendarURL}
            placeholder="e.g., https://outlook.office.com/"
        />
    </div>

    <div class="form-group">
        <label for="language">Language</label>
        <select bind:value={settings.language} id="language">
            {#each languages as lang}
                <option value={lang}>{lang}</option>
            {/each}
        </select>
    </div>

    <div class="form-group">
        <label>Appearance</label>
        {#each appearanceOptions as option}
            <label class="radio-label">
                <input
                    type="radio"
                    name="appearance"
                    value={option}
                    bind:group={settings.appearance}
                />
                {option}
            </label>
        {/each}
    </div>

    <div class="form-group">
        <label>Text Size</label>
        {#each textSizeOptions as option}
            <label class="radio-label">
                <input
                    type="radio"
                    name="textSize"
                    value={option}
                    bind:group={settings.textSize}
                />
                {option}
            </label>
        {/each}
    </div>

    <div class="form-group">
        <label for="shortcut">Shortcut Key</label>
        <input
            type="text"
            id="shortcut"
            bind:value={settings.shortcutKey}
            placeholder="e.g., Ctrl+Shift+K"
        />
    </div>

    <div class="form-group">
        <label for="sidebarPosition">Sidebar Position</label>
        <select bind:value={settings.sidebarPosition} id="sidebarPosition">
            {#each sidebarPositions as position}
                <option value={position}>{position}</option>
            {/each}
        </select>
    </div>

    <div class="form-group toggle-group">
        <label for="powerUp">Power-Up Bar</label>
        <label class="switch">
            <input 
                type="checkbox" 
                id="powerUp" 
                bind:checked={settings.powerUpEnabled}
            />
            <span class="slider"></span>
        </label>
    </div>

    <button type="button" class="save-settings" on:click={saveSettings}>
        Save Settings
    </button>
</form>