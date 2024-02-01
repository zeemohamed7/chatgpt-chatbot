import openai from "./config/open-ai.js";
import readlineSync from 'readline-sync';
import colors from 'colors';

// Using method createChatCompletion (this is an async method so use async)
// async function main() {
//     // passing an object into the method
//     const chatCompletion = await openai.chat.completions.create({
//         model: 'gpt-3.5-turbo',
//         // messages have to be an array
//         messages: [
//             { role: 'user', content: 'How old is Bahrain?' } // the user is making the request and sending the content
//         ]
//     });

//     console.log(chatCompletion.choices[0].message);
// }

async function main() {
    // readline is basically input()
    console.log(colors.bold.green('Welcome to the Chatbot Program!'))
    console.log(colors.bold.green('You can start chatting with the bot.'))

    const chatHistory = []; // Store conversation history

    while (true) {
        const userInput = readlineSync.question(colors.yellow('You: '))
            // Validate user input
        if (!userInput) {
            console.log(colors.red('Error: Empty input. Please provide a valid input.'));
            continue;
        }
        try {
            // Construct messages by iterating over history
            const messages = chatHistory.map(([role, content]) => ({role, content}))

            // Add latest user input
            messages.push({"role": "user", "content": userInput })
            // Call the API with user input
            const chatCompletion = await openai.chat.completions.create({
                model: "gpt-3.5-turbo",
                messages: messages, // Entire chat history sent to API, not just recent userInput
              });
            // Get completion text/content
            const completionText = chatCompletion.choices[0].message.content;

            // Exit loop
            if (userInput.toLowerCase() === 'exit') {
                console.log(colors.green('Bot: ' + completionText)) // Says goodbye :)
                return;
            }

            // Update history with user input and assistant response
            chatHistory.push(['user', userInput])
            chatHistory.push(['assistant', completionText])

            console.log(colors.green('Bot: ' + completionText))
        } catch (error) {
            console.error(colors.red(error.message))
        }
    }
}

main();

