document.addEventListener('DOMContentLoaded', function() {
    const quoteText = document.getElementById('quote-text');
    const quoteAuthor = document.getElementById('quote-author');
    const newQuoteBtn = document.getElementById('new-quote-btn');
    
    // Collection of motivational quotes
    const quotes = [
        {
            text: "Act as if what you do makes a difference. It does.",
            author: "William James"
        },
        {
            text: "With the new day comes new strength and new thoughts.",
            author: "Eleanor Roosevelt"
        },
        {
            text: "Do what you can, with what you have, where you are.",
            author: "Theodore Roosevelt"
        },
        {
            text: "Keep your face always toward the sunshine—and shadows will fall behind you.",
            author: "Walt Whitman"
        },
        {
            text: "If opportunity doesn’t knock, build a door.",
            author: "Milton Berle"
        },
        {
            text: "The secret of getting ahead is getting started.",
            author: "Mark Twain"
        },
        {
            text: "Start where you are. Use what you have. Do what you can.",
            author: "Arthur Ashe"
        },
        {
            text: "I find that the harder I work, the more luck I seem to have.",
            author: "Thomas Jefferson"
        },
        {
            text: "Opportunities don't happen. You create them.",
            author: "Chris Grosser"
        },
        {
            text: "Don't be afraid to give up the good to go for the great.",
            author: "John D. Rockefeller"
        },
        {
            text: "If you set your goals ridiculously high and it's a failure, you will fail above everyone else's success.",
            author: "James Cameron"
        },
        {
            text: "The road to success and the road to failure are almost exactly the same.",
            author: "Colin R. Davis"
        },
        {
            text: "It is better to fail in originality than to succeed in imitation.",
            author: "Herman Melville"
        },
        {
            text: "Success usually comes to those who are too busy to be looking for it.",
            author: "Henry David Thoreau"
        },
        {
            text: "The only place where success comes before work is in the dictionary.",
            author: "Vidal Sassoon"
        },
        {
            text: "If you really look closely, most overnight successes took a long time.",
            author: "Steve Jobs"
        },
        {
            text: "Success is walking from failure to failure with no loss of enthusiasm.",
            author: "Winston Churchill"
        },
        {
            text: "Try not to become a man of success. Rather become a man of value.",
            author: "Albert Einstein"
        },
        {
            text: "The harder the conflict, the greater the triumph.",
            author: "George Washington"
        },
        {
            text: "The only impossible journey is the one you never begin.",
            author: "Tony Robbins"
        },
        {
            text: "Do what you feel in your heart to be right—for you’ll be criticized anyway.",
            author: "Eleanor Roosevelt"
        },
        {
            text: "Don't let yesterday take up too much of today.",
            author: "Will Rogers"
        },
        {
            text: "Whether you think you can or you think you can’t, you’re right.",
            author: "Henry Ford"
        },
        {
            text: "Everything you’ve ever wanted is on the other side of fear.",
            author: "George Addair"
        },
        {
            text: "You become what you believe.",
            author: "Oprah Winfrey"
        },
        {
            text: "Happiness is not something ready-made. It comes from your own actions.",
            author: "Dalai Lama"
        },
        {
            text: "When one door closes, another opens.",
            author: "Alexander Graham Bell"
        },
        {
            text: "The best revenge is massive success.",
            author: "Frank Sinatra"
        },
        {
            text: "The best preparation for tomorrow is doing your best today.",
            author: "H. Jackson Brown Jr."
        },
        {
            text: "All progress takes place outside the comfort zone.",
            author: "Michael John Bobak"
        },
        {
            text: "Courage is resistance to fear, mastery of fear, not absence of fear.",
            author: "Mark Twain"
        },
        {
            text: "What lies behind us and what lies before us are tiny matters compared to what lies within us.",
            author: "Ralph Waldo Emerson"
        },
        {
            text: "It is during our darkest moments that we must focus to see the light.",
            author: "Aristotle"
        },
        {
            text: "Believe in yourself and all that you are. Know that there is something inside you that is greater than any obstacle.",
            author: "Christian D. Larson"
        },
        {
            text: "If you want to achieve greatness stop asking for permission.",
            author: "Anonymous"
        },
        {
            text: "The successful warrior is the average man, with laser-like focus.",
            author: "Bruce Lee"
        },
        {
            text: "Your limitation—it's only your imagination.",
            author: "Anonymous"
        },
        {
            text: "Push yourself, because no one else is going to do it for you.",
            author: "Anonymous"
        },
        {
            text: "Great things never come from comfort zones.",
            author: "Anonymous"
        },
        {
            text: "Dream it. Wish it. Do it.",
            author: "Anonymous"
        },
        {
            text: "Stay hungry, stay foolish.",
            author: "Steve Jobs"
        },
        {
            text: "Doubt kills more dreams than failure ever will.",
            author: "Suzy Kassem"
        },
        {
            text: "Work hard in silence, let success be your noise.",
            author: "Frank Ocean"
        },
        {
            text: "I never dream of success. I work for it.",
            author: "Estee Lauder"
        },
        {
            text: "Make each day your masterpiece.",
            author: "John Wooden"
        },
        {
            text: "You can either experience the pain of discipline or the pain of regret. The choice is yours.",
            author: "Anonymous"
        },
        {
            text: "A goal is not always meant to be reached; it often serves simply as something to aim at.",
            author: "Bruce Lee"
        },
        {
            text: "Don't wish it were easier. Wish you were better.",
            author: "Jim Rohn"
        },
        {
            text: "Discipline is the bridge between goals and accomplishment.",
            author: "Jim Rohn"
        },
        {
            text: "The best way out is always through.",
            author: "Robert Frost"
        },
        {
            text: "There is no traffic jam along the extra mile.",
            author: "Roger Staubach"
        },
        {
            text: "Do not go where the path may lead, go instead where there is no path and leave a trail.",
            author: "Ralph Waldo Emerson"
        },
        {
            text: "Do something today that your future self will thank you for.",
            author: "Anonymous"
        },
        {
            text: "Life isn’t about finding yourself. Life is about creating yourself.",
            author: "George Bernard Shaw"
        },
        {
            text: "Small deeds done are better than great deeds planned.",
            author: "Peter Marshall"
        },
        {
            text: "An unexamined life is not worth living.",
            author: "Socrates"
        },
        {
            text: "Life is what happens when you’re busy making other plans.",
            author: "John Lennon"
        }
    ];
    
    let currentQuoteIndex = 0;
    
    // Function to display a new random quote with animation
    function showNewQuote() {
        // Add fade out class
        quoteText.classList.add('quote-fade-out');
        quoteAuthor.classList.add('quote-fade-out');
        
        // Wait for fade out animation to complete
        setTimeout(() => {
            // Get a new random quote (different from current)
            let newIndex;
            do {
                newIndex = Math.floor(Math.random() * quotes.length);
            } while (newIndex === currentQuoteIndex && quotes.length > 1);
            
            currentQuoteIndex = newIndex;
            
            // Update the quote text and author
            quoteText.textContent = quotes[currentQuoteIndex].text;
            quoteAuthor.textContent = "- " + quotes[currentQuoteIndex].author;
            
            // Remove fade out and add fade in classes
            quoteText.classList.remove('quote-fade-out');
            quoteAuthor.classList.remove('quote-fade-out');
            quoteText.classList.add('quote-fade-in');
            quoteAuthor.classList.add('quote-fade-in');
            
            // Remove fade in class after animation completes
            setTimeout(() => {
                quoteText.classList.remove('quote-fade-in');
                quoteAuthor.classList.remove('quote-fade-in');
            }, 500);
        }, 500);
    }

    newQuoteBtn.addEventListener('click', showNewQuote);
    currentQuoteIndex = Math.floor(Math.random() * quotes.length);
    quoteText.textContent = quotes[currentQuoteIndex].text;
    quoteAuthor.textContent = "- " + quotes[currentQuoteIndex].author;
    setInterval(showNewQuote, 80000);
});