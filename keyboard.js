const keyboardListener = new SDL.manager.screen.choiceset.KeyboardListener()
    .setOnUserDidSubmitInput((inputText, event) => {
        switch (event) {
            case SDL.rpc.enums.KeyboardEvent.ENTRY_VOICE:
                // The user decided to start voice input, you should start an AudioPassThru session if supported
                break;
            case SDL.rpc.enums.KeyboardEvent.ENTRY_SUBMITTED:
                // The user submitted some text with the keyboard
                break;
            default:
                break;
        }
    })
    .setOnKeyboardDidAbortWithReason((event) => {
        switch (event) {
            case SDL.rpc.enums.KeyboardEvent.ENTRY_CANCELLED:
                // The user cancelled the keyboard interaction
                break;
            case SDL.rpc.enums.KeyboardEvent.ENTRY_ABORTED:
                // The system aborted the keyboard interaction
                break;
            default:
                break;
        }
    })
    .setUpdateAutocompleteWithInput((currentInputText, keyboardAutocompleteCompletionListener) => {
        // Check the input text and return a list of autocomplete results
        keyboardAutocompleteCompletionListener(updatedAutoCompleteList);
    })
    .setUpdateCharacterSetWithInput((currentInputText, keyboardCharacterSetCompletionListener) => {
        // Check the input text and return a set of characters to allow the user to enter
    })
    .setOnKeyboardDidSendEvent((event, currentInputText) => {
        // This is sent upon every event, such as keypresses, cancellations, and aborting
    })
    .setOnKeyboardDidUpdateInputMask((event) => {
        switch (event) {
            case SDL.rpc.enums.KeyboardEvent.INPUT_KEY_MASK_ENABLED:
                // The user enabled input key masking
                break;
            case SDL.rpc.enums.KeyboardEvent.INPUT_KEY_MASK_DISABLED:
                // The user disabled input key masking
                break;
            default:
                break;
        }
    });
