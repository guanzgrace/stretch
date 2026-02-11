// popup javascript

const FREQ_OPTIONS = [
    { value: 30, label: "Every 30 Minutes" },
    { value: 60, label: "Every 1 Hour" },
    { value: 120, label: "Every 2 Hours" },
];

const TYPE_OPTIONS = [
    { value: "upperbody", label: "Upper Body" },
    { value: "lowerbody", label: "Lower Body" },
    { value: "fullbody", label: "Full Body" },
];

// Advances an option button to the next value in its array (wrapping around).
async function cycleOption(element, options, storageKey, onSave) {
    const currentLabel = element.firstChild.data;
    const currentIndex = options.findIndex(opt => opt.label === currentLabel);
    const nextIndex = (currentIndex + 1) % options.length;
    const next = options[nextIndex];

    element.firstChild.data = next.label;
    await chrome.storage.local.set({ [storageKey]: next.value });
    console.log(`Set ${storageKey} to ${next.value}.`);
    if (onSave) onSave();
}

// Loads saved preferences from storage and applies them to the popup UI.
(async () => {
    const option = await chrome.storage.local.get(['enabled', 'freq', 'type']);

    const checkbox = document.getElementById("checkbox1");
    checkbox.checked = option.enabled !== false;

    const freqLabel = FREQ_OPTIONS.find(o => o.value === option.freq)?.label
        ?? FREQ_OPTIONS[0].label;
    document.getElementById("frequency").firstChild.data = freqLabel;

    const typeLabel = TYPE_OPTIONS.find(o => o.value === option.type)?.label
        ?? TYPE_OPTIONS[0].label;
    document.getElementById("type").firstChild.data = typeLabel;
})();

document.getElementById("checkbox1").addEventListener('click', async () => {
    const enabled = document.getElementById("checkbox1").checked;
    await chrome.storage.local.set({ enabled });
    console.log(`Enabled set to ${enabled}.`);
});

document.getElementById("frequency").addEventListener('click', () => {
    cycleOption(
        document.getElementById("frequency"),
        FREQ_OPTIONS,
        'freq',
        () => chrome.runtime.sendMessage({ action: 'recreateAlarm' })
    );
});

document.getElementById("type").addEventListener('click', () => {
    cycleOption(document.getElementById("type"), TYPE_OPTIONS, 'type');
});

document.getElementById("notification").addEventListener('click', () => {
    chrome.runtime.sendMessage({ action: 'openNotification' });
    window.close();
});
