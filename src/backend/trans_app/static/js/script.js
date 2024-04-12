/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   script.js                                          :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: abaiao-r <abaiao-r@student.42.fr>          +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2024/03/27 20:36:31 by abaiao-r          #+#    #+#             */
/*   Updated: 2024/04/12 13:18:32 by abaiao-r         ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

// Add event listener to the window object to listen for hash changes
window.addEventListener('hashchange', function(event) {
    // If href not in section_hrefs go to home page
    if (section_hrefs.indexOf((new URL(event.newURL)).hash) == -1) {
        window.location.href = HOME_HREF;
        goToPage(HOME_HREF)
    }
    // If the new URL is the same as the old URL, do nothing
    else if (event.newURL === event.oldURL) {
        return;
    }
    else {
        goToPage((new URL(event.newURL)).hash);
    }
});


addNavItemsListeners();
// Make the home page the default page
hideAllSections();
window.location.href = HOME_HREF;
goToPage(HOME_HREF);
console.log("script.js loaded");
