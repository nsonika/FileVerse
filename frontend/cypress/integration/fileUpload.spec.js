import "cypress-file-upload";

describe("File Upload and Management Tests", () => {
  const fileName = "example.csv";

  beforeEach(() => {
    // Visit the homepage before each test
    cy.visit("/");
  });

  it("Uploads a file and displays progress", () => {
    // Select a file to upload
    cy.get("#fileInput").attachFile(fileName);

    // Click on the Start Upload button
    cy.contains("Start Upload").click();

    // Verify the progress bar shows progress
    cy.get(".relative.w-24.h-2.bg-gray-200").within(() => {
      cy.get(".absolute.bg-blue-500").should("exist");
    });

    // Verify the file is listed with the correct name
    cy.contains(fileName).should("exist");
  });

  it("Displays Start All Uploads button and uploads all files", () => {
    // Select multiple files to upload
    const fileNames = ["example1.csv", "example2.csv"];
    fileNames.forEach((file) => {
      cy.get("#fileInput").attachFile(file);
    });

    // Click on the Start All Uploads button
    cy.contains("Start Upload").click();

    // Verify the progress bars for all files
    fileNames.forEach((file) => {
      cy.contains(file).should("exist");
      cy.get(".relative.w-24.h-2.bg-gray-200").within(() => {
        cy.get(".absolute.bg-blue-500").should("exist");
      });
    });
  });

  //   it("Cancels an upload", () => {
  //     cy.get("#fileInput").attachFile(fileName);
  //     cy.contains("Start All Uploads").click();

  //     // Cancel the upload
  //     cy.contains(fileName)
  //       .parent()
  //       .within(() => {
  //         cy.contains("Cancel").click();
  //         cy.contains("Status: canceled").should("be.visible");
  //       });
  //   });

  it("Downloads a file", () => {
    // Navigate to file management page
    cy.visit("/files");

    // Click download and check if the file exists in the downloads folder
    cy.contains(fileName)
      .parent()
      .within(() => {
        cy.contains("Download").click();
      });
    cy.readFile(`cypress/downloads/${fileName}`).should("exist");
  });

  const appwriteBaseUrl = "https://cloud.appwrite.io"; // Replace with the base URL of your Appwrite setup

  it("Allows previewing a file in a new tab if URL contains Appwrite", () => {
    // Navigate to the file management page
    cy.visit("/files");

    // Wait for the files to load
    cy.contains(fileName, { timeout: 10000 }).should("exist");

    // Find the file in the list and check the Preview button
    cy.contains(fileName)
      .parent()
      .within(() => {
        cy.contains("Preview")
          .should("have.attr", "href") // Ensure it has an href attribute
          .then((href) => {
            // Log the href attribute to debug
            cy.log("Preview button href:", href);

            // Assert the href includes the Appwrite base URL
            expect(href).to.include(appwriteBaseUrl);
          });
      });
  });
});

//   it("Resumes an interrupted upload", () => {
//     cy.get("#fileInput").attachFile(fileName);
//     cy.contains("Start All Uploads").click();

//     // Simulate an interruption by canceling and then resuming
//     cy.contains(fileName)
//       .parent()
//       .within(() => {
//         cy.contains("Cancel").click();
//         cy.contains("Status: canceled").should("be.visible");

//         cy.contains("Resume").click();
//         cy.contains("Status: completed").should("be.visible");
//       });
//   });
