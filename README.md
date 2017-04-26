# ZeroTranslate

ZeroTranslate is a tool to make working with ZeroNet language files easier.

It has it's own shell.

# Usage

First install it with `npm i -g zero-translate` (may need sudo/admin)

Now you can run either `zero-translate` directly in the root of the zite or `zero-translate /path/to/zeronet/data/1Zite`

ZeroTranslate now should generate an index of all words in `languages/_.json`

After that you should be greated with a shell like **`translate:1Zite>`**

Small overview of the commands

```
sync         [<lang>]   Add missing strings (call before translating). Accepts *
unsync       [<lang>]   Remove empty strings (call after translating). Accepts *
add          [<string>] Add new string to index (does not sync)                 
rm           [<string>] Remove string from index (does sync)                    
use          [<lang>]   Use language                                            
langs                   List all languages                                      
langadd      <lang>     Add new language                                        
help                    Show this help                                          
index                   List all words in the index                             
untranslated [<lang>]   List all untranslated strings. Accepts *                
exit                    Close the app                                           
```

It saves automatically so you don't need to worry if you Ctrl+C it
