/** @odoo-module */

import tour from 'web_tour.tour';
import wTourUtils from 'website.tour_utils';

const clickOnImgStep = {
    content: "Click somewhere else to save.",
    trigger: '#wrap .s_text_image img',
};

tour.register(
  "link_tools",
  {
    test: true,
    url: "/?enable_editor=1",
  },
  [
    // 1. Create a new link from scratch.
    wTourUtils.dragNDrop({
      id: "s_text_image",
      name: "Text - Image",
    }),
    {
      content: "Replace first paragraph, to insert a new link",
      trigger: "#wrap .s_text_image p",
      run: "text Go to Bookm: ",
    },
    {
      content: "Open link tools",
      trigger: "#toolbar #create-link",
    },
    {
      content: "Type the link URL bookm.be",
      trigger: "#o_link_dialog_url_input",
      run: "text bookm.be",
    },
    clickOnImgStep,
    // 2. Edit the link with the link tools.
    {
      content:
        "Click on the newly created link, change content to Bookm website",
      trigger: '.s_text_image a[href="http://bookm.be"]:contains("bookm.be")',
      run: "text Bookm website",
    },
    {
      content: "Link tools, should be open, change the url",
      trigger: "#o_link_dialog_url_input",
      run: "text mybookm.com",
    },
    clickOnImgStep,
    ...wTourUtils.clickOnSave(),
    // 3. Edit a link after saving the page.
    wTourUtils.clickOnEdit(),
    {
      content:
        "The new link content should be Bookm website and url mybookm.com",
      extra_trigger: "#oe_snippets.o_loaded",
      trigger:
        '.s_text_image a[href="http://mybookm.com"]:contains("Bookm website")',
    },
    {
      content:
        "The new link content should be Bookm website and url mybookm.com",
      trigger: '#toolbar button[data-original-title="Link Style"]',
    },
    {
      content: "Click on the secondary style button.",
      trigger: '#toolbar we-button[data-value="secondary"]',
    },
    ...wTourUtils.clickOnSave(),
    {
      content: "The link should have the secondary button style.",
      trigger:
        '.s_text_image a.btn.btn-secondary[href="http://mybookm.com"]:contains("Bookm website")',
      run: () => {}, // It's a check.
    },
  ]
)
