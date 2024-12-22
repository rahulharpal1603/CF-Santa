(function () {
    // URL of the JSON file
    const jsonUrl = "https://raw.githubusercontent.com/rahulharpal1603/json/refs/heads/main/handles.json";
    console.log("Content script loaded");

    // Fetch the JSON file
    fetch(jsonUrl)
        .then(response => response.json())
        .then(data => {
            console.log("Data fetched successfully:", data);

            // Preprocess the JSON into a lookup Map
            const handleMap = new Map();
            for (const [key, handles] of Object.entries(data)) {
                handles.forEach(handle => handleMap.set(handle.toLowerCase(), key));
            }
            // Find all anchor tags with href of the form /profile/*
            const anchorTags = document.querySelectorAll('a[href^="/profile/"].rated-user');

            anchorTags.forEach(anchor => {
                // Skip if the innerHTML contains any images
                if (anchor.querySelector("img")) {
                    return;
                }

                const href = anchor.getAttribute("href");
                const handle = href.split("/profile/")[1]; // Extract the handle

                // Check if the handle exists in the Map
                const match = handleMap.get(handle.toLowerCase());
                if (match) {
                    // Format the handle: First letter red, rest black
                    const formattedHandle = `<span style="color: red !important;">${handle[0]}</span><span style="color: black !important;">${handle.slice(1)}</span>`;

                    // Update the anchor tag
                    anchor.innerHTML = formattedHandle;
                    anchor.setAttribute("title", `Tourist ${handle}`);
                    anchor.setAttribute("class", "rated-user");
                    const ratingSpan2 = document.querySelector('.propertyLinks li span[class^="user-"]');
                    if (ratingSpan2) {
                        ratingSpan2.setAttribute("class", "user-tourist");
                    }
                }
            });

            // Check if the current page is a user's profile page
            const profileHeader = document.querySelector('.info .main-info h1 a[href^="/profile/"]');
            if (profileHeader) {
                const profileHandle = profileHeader.getAttribute("href").split("/profile/")[1];
                const profileMatch = handleMap.get(profileHandle.toLowerCase());

                if (profileMatch) {
                    // Update the user rank
                    const ratingSpan = document.querySelector('.info ul span[class^="user-"]');
                    console.log(ratingSpan);
                    if (ratingSpan) {
                        ratingSpan.setAttribute("class", "user-tourist");
                    }


                    const userRankElement = document.querySelector('.user-rank span');
                    if (userRankElement) {
                        userRankElement.textContent = "Tourist";
                        userRankElement.setAttribute("class", "user-tourist");
                    }

                    // Update the rating span
                }
            }
        })
        .catch(error => {
            console.error("Error fetching the JSON file:", error);
        });
})();
