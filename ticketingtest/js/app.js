//Getting a Current User
domo.get(`/domo/users/v1?/includeDetails=true&limit=150`).then(function (data) {
  data.forEach(temp => {
    if (temp.id == domo.env.userId) {
      document.getElementById("navbar-name").innerHTML= "Welcome <b>" + temp.displayName + '</b>';
    }
    //console.log(temp.displayName)
  });
});

// getting All users
const parent = document.getElementById("people-list-candidate");
domo.get(`/domo/users/v1?includeDetails=true&limit=200`).then(function (data) {
  //username and id
  data.forEach((element) => {
    const username = document.createElement("option");
    username.value = element.id;
    username.textContent = element.displayName;
    parent.appendChild(username);
  });
});

const user = domo.env.userId;
let current_user;

domo.get(`/domo/users/v1/${user}?includeDetails=true`).then(function(data){
  current_user = data.displayName;
  //console.log(current_user)
});

const navbar_menu = document.getElementById("navMenu");
const nav_list = document.getElementById("nav-list");
navbar_menu.addEventListener("click", () => {
  nav_list.style.display='block';
  create_ticket_details.style.display = 'none';
  create_team_details.style.display = 'none';
  manage_ticket_details.style.display = 'none';
  manage_team_details.style.display = 'none';
});

const create_ticket = document.getElementById("create-ticket");
const create_ticket_details = document.getElementById("drop-depart");
create_ticket.addEventListener("click", () => {
  create_ticket_details.style.display = 'block';
  create_team_details.style.display = 'none';
  manage_ticket_details.style.display = 'none';
  manage_team_details.style.display = 'none';
});

const create_team = document.getElementById("create-team");
const create_team_details = document.getElementById("create-teams-details");
create_team.addEventListener("click", () => {
  create_team_details.style.display = 'block';
  manage_team_details.style.display = 'none';
  manage_ticket_details.style.display = 'none';
  create_ticket_details.style.display = 'none';
});

//manage ticket
const manage_ticket = document.getElementById("manage-ticket");
const manage_ticket_details = document.getElementById("manage-ticket-details");
manage_ticket.addEventListener("click", () => {
  manage_ticket_details.style.display = 'block';
  manage_team_details.style.display = 'none';
  create_team_details.style.display = 'none';
  create_ticket_details.style.display = 'none';
  fetchticketData();
});

function fetchticketData() {
  domo.get('/domo/datastores/v1/collections/Ticketing_tool/documents')
    .then(data => {
      console.log(data)
      fetchDisplayTicket(data)
    })
  
}

function fetchDisplayTicket(data) {
  const table_ticket_Body = document.getElementById("table-ticket-body");
  table_ticket_Body.innerHTML = ''; 

    data.forEach(ticket => {
      // console.log(ticket)
            const row = document.createElement('tr');
            row.setAttribute("data-id", ticket.id);

            const nameCell = document.createElement('td');
            nameCell.textContent = ticket.content.departments.departments;
            // row.appendChild(nameCell);

            const peopleCell = document.createElement('td');
            peopleCell.textContent =ticket.content.ticket_name.ticket_name;
            // row.appendChild(peopleCell);

            const ticketCell = document.createElement('td');
            ticketCell.textContent =ticket.content.ticket_details.ticket_details;
            // row.appendChild(ticketCell);

            //Edit
            const editbtn = document.createElement("button");
            editbtn.className = "editbtn";
            editbtn.innerText = "Edit";
            editbtn.addEventListener("click",() => {
              document.getElementById("select-drop-list").value = ticket.content.departments.departments;
              document.getElementById("ticket-name").value = ticket.content.ticket_name.ticket_name;
              document.getElementById("ticket-details").value = ticket.content.ticket_details.ticket_details;
              // Show the create ticket form
              manage_ticket_details.style.display = 'none';
              create_ticket_details.style.display = 'block';
              // Set a flag or data attribute for the current editing ticket
              document.getElementById("ticket-submit-btn").setAttribute("data-edit-id", ticket.id);
            });
            
            const deleteId = ticket.id;
            const deletebtn = document.createElement("button"); //create tag
            deletebtn.className = 'deletebtn';
            deletebtn.innerText = "Delete";
            deletebtn.addEventListener("click",() => {
              // console.log("ticket---->",ticket);
              domo.delete(`/domo/datastores/v1/collections/Ticketing_tool/documents/${deleteId}`)
              .then((data) =>{
                console.log("data deleted",data);
                table_ticket_Body.removeChild(row);
              })
            });
              console.log(nameCell)
              console.log(ticketCell)
              console.log(peopleCell)

              row.appendChild(nameCell);
              row.appendChild(peopleCell);
              row.appendChild(ticketCell);
              row.appendChild(editbtn);
              row.appendChild(deletebtn);
              table_ticket_Body.appendChild(row);
            })

           
          }
      // const tr = document.createElement("tr");
      // const td1 = document.createElement("td");
      // const td2 = document.createElement("td");
      // const td3 = document.createElement("td");
      // td1.textContent = ticket.content.departments.departments;
      // tr.appendChild(td1)
      // document.getElementById("table-ticket-body").appendChild(tr);
      // const row = `
      //   <tr>
      //     <td>${ticket.content.departments.departments}</td
      //     <td>${ticket.content.ticket_name.ticket_name}</td>
      //     <td>${ticket.content.ticket_details.ticket_details}</td>
      //     <td>
      //       <button class="edit-btn">Edit</button>
      //       <button class="delete-btn" onclick="deleteItems(${ticket.id})">Delete</button>
      //     </td>
      //   </tr>`;
      
      // table_ticket_Body.insertAdjacentHTML('beforeend', row);

// function deleteItems(teamid){
//   // domo.delete(`/domo/datastores/v1/collections/Users/documents/1e61d99d-9885-419a-a33e-3be3941ee720`);
//   console.log(teamid)

// }

//manage team
const manage_team = document.getElementById("manage-team");
const manage_team_details = document.getElementById("manage-team-details");
manage_team.addEventListener("click", () => {
  manage_team_details.style.display = 'block';
  manage_ticket_details.style.display = 'none';
  create_ticket_details.style.display = 'none';
  create_team_details.style.display = 'none';
  fetchteamData();
});

function fetchteamData() {
  domo.get('/domo/datastores/v1/collections/ticket_team/documents')
  .then(data => {
    console.log(data)
    fetchDisplayTeams()
  })
}
  
function fetchDisplayTeams() {
  const table_team_Body = document.getElementById("table-team-body");
  table_team_Body.innerHTML = ''; 

  
  // Fetch data from Domo API to display existing teams
  domo.get(`/domo/datastores/v1/collections/ticket_team/documents`)
    .then(function (data) {
      // console.log(data);
      data.forEach(team => { 
        // console.log('team',team)
            const row = document.createElement("tr");
            row.setAttribute("data-id", team.id);

            const teamCell = document.createElement('td');
            teamCell.textContent = team.content.team_name.team_name;
            // row.appendChild(teamCell);

            const memberCell = document.createElement('td');
            memberCell.textContent =team.content.team_user.team_user;
            // row.appendChild(memberCell);

            
            const editbtn = document.createElement("button");
            editbtn.className = "editbtn";
            editbtn.innerText = "Edit";
            editbtn.addEventListener("click",() => {
              manage_team_details.style.display = 'none';
              create_team_details.style.display = 'block'
            })
            
            const deleteId = team.id;
            const deletebtn = document.createElement("button"); //create tag
            deletebtn.className = 'deletebtn';
            deletebtn.innerText = "Delete";
            deletebtn.addEventListener("click",() => {
              domo.delete(`/domo/datastores/v1/collections/ticket_team/documents/${deleteId}`)
              .then((data) =>{
                console.log("data deleted",data);
                table_team_Body.removeChild(row)
              })
              .catch((error) => {
                console.error('Failed to delete:', error);
                // Handle error scenarios if needed
              });
            })

            console.log(teamCell)
            console.log(memberCell)

              row.appendChild(teamCell);
              row.appendChild(memberCell);
              row.appendChild(editbtn);
              row.appendChild(deletebtn);
              table_team_Body.appendChild(row);
            });
          })
          .catch(error => {
            console.error("Error fetching teams:", error);
            alert("Failed to fetch team data. Please try again.");
          })
        };


  
  // team submission
  const team_submit = document.getElementById("team-submit-btn");
  const errorMessageTeam = document.getElementById("error-message-team");
  const errorTextName = document.getElementById("error-text-name");
  const errorMessage = document.getElementById("error-message");
  const errorText = document.getElementById("error-text");

  team_submit.addEventListener("click", () => {
  const team_name = document.getElementById("team-name").value;
  const selectpeople = document.getElementById("people-list-candidate");
  const selectedOptions = Array.from(selectpeople.selectedOptions).map(option => ({
    id: option.value,
    displayName: option.textContent
  }));
  // console.log(selectedOptions);
  const editId = ticket_submit.getAttribute("data-edit-id");

  // fetchteamData()
  

  // Validate team name input
  if (!team_name) {
    errorText.textContent = "Please fill all fields.";
    errorMessage.classList.add("show");
    setTimeout(() => {
      errorMessage.classList.remove("show");
    }, 3000);
    return;
  }
 
  const dropdown = document.getElementById("select-drop-list");
  const existingDropdownOption = Array.from(dropdown.options).find(option => option.textContent === team_name);
  
  if (existingDropdownOption) {
    errorTextName.textContent = "Team name already exists. Please use another name.";
    errorMessageTeam.classList.add("show");
    setTimeout(() => {
      errorMessageTeam.classList.remove("show");
    }, 3000);
    return;
  }
 

  if (!Array.from(dropdown.options).some(option => option.textContent === team_name)) {
    const option = document.createElement("option");
    option.value = team_name; // Use team_name for the value
    option.textContent = team_name; // Use team_name for the text
    dropdown.appendChild(option);
    // console.log(option.value);
  }


  // Clear input fields after submission
  document.getElementById("team-name").value = "";
  selectpeople.value = '';

  const memberName = selectedOptions.map((member) =>member.displayName);
  const memberId = selectedOptions.map((member) => member.id)

  const finalTeamData= {
    content:{
      team_name:{
        team_name:`${team_name}`
      },
      team_user:{
        team_user: `${memberName}`
      },
      team_Id:{
        team_Id:`${memberId}`
      }
    }
  }

domo.get(`/domo/datastores/v1/collections/ticket_team/documents`)
.then((data) => {
  console.log("Checking ", data)
  const dropdown = document.getElementById("select-drop-list");
  dropdown.innerHTML = '';

  data.forEach((user) => {
    // console.log("user",user)

    const teamId = user.content?.team_Id?.team_Id; 
    const teamName = user.content?.team_name?.team_name;

    const userOption = document.createElement('option');
    userOption.value = teamId;            
    userOption.text = teamName;                               
    dropdown.appendChild(userOption);
  });
})
.catch(error => {
  console.error("Failed to fetch data:", error);
});

// errorMessage.classList.remove("show");
// errorMessageTeam.classList.remove("show");
// });


if (editId) {
  // Editing existing ticket
  domo.put(`/domo/datastores/v1/collections/ticket_team/documents/${editId}`, finalTeamData)
    .then(response => {
      console.log("Ticket updated:", response);
      fetchDisplayTeams(); // Refresh the ticket list
      team_submit.removeAttribute("data-edit-id"); // Clear the edit flag
      // Hide the create ticket form
      create_team_details.style.display = 'none';
      manage_team_details.style.display = 'block';
    })
    .catch(error => {
      console.error("Failed to update ticket:", error);
      alert("Failed to update ticket. Please try again.");
    });
} else {
  // Creating new ticket
  domo.post(`/domo/datastores/v1/collections/ticket_team/documents`, finalTeamData)
    .then(response => {
      console.log("Ticket created:", response);
      fetchDisplayTeams(); // Refresh the ticket list
    })
    .catch(error => {
      console.error("Failed to create ticket:", error);
      alert("Failed to create ticket. Please try again.");
    });
}
const notification = document.getElementById("notification");
  notification.classList.add("show");

  setTimeout(function () {
    notification.classList.remove("show");
  }, 3000);
});
// // fetchteamData()



// Event listener for ticket submission
  // const errorTextName = document.getElementById("error-text-name");
  // const errorMessage = document.getElementById("error-message");
  
  const ticket_submit = document.getElementById("ticket-submit-btn");
  const errorMessageTicket = document.getElementById("error-message-ticket");
  const errorTextTicket = document.getElementById("error-text-ticket");
  

  ticket_submit.addEventListener("click", () => {
  const dropdown = document.getElementById("select-drop-list");
  const ticket_name = document.getElementById("ticket-name").value;
  const ticket_details = document.getElementById("ticket-details").value;
  // const selectperson = Array.from(dropdown.selectedOptions).map(option=>option.value);
  // console.log('dropdown',selectperson);
  const editId = ticket_submit.getAttribute("data-edit-id");

  // const eachUserId = dropdown.value;
  // console.log("findId------>",eachUserId)

  const selectedOption = dropdown.options[dropdown.selectedIndex];
  const eachUserId = selectedOption ? selectedOption.value : null;
  const eachUserName = selectedOption ? selectedOption.textContent : null;
  // fetchData()

  if (!dropdown || !ticket_name || !ticket_details) {
    errorTextTicket.textContent = "Please fill out all fields.";
    errorMessageTicket.classList.add("show");
    setTimeout(() => {
      errorMessageTicket.classList.remove("show");
    }, 3000);
    return;
  }
    

    document.getElementById("select-drop-list").value = "";
    document.getElementById("ticket-name").value = "";
    document.getElementById("ticket-details").value = "";
   
    const body_content = `
      Ticket Name: ${ticket_name} <br> Ticket Details: ${ticket_details}`;

    //    const selectElement = document.getElementById("people-list-candidate");
    //   console.log(selectElement);d

    // const selectedOptions = Array.from(selectElement.selectedOptions).map(option=>option.value);
    // console.log("send mail person---->",selectedOptions)


    const finalticketData = {
      content: {
        departments:{
          departments: `${eachUserName}`
        },
        ticket_name:{
          ticket_name: `${ticket_name}`
        },
        ticket_details:{
          ticket_details: `${ticket_details}`
        }
    }
    }
    
    const startWorkflow = (alias, body) => {
      domo.post(`/domo/workflow/v1/models/${alias}/start`, body);
    };
    // selectedOptions.forEach(user =>{
    //   const UserId = user.value;
      startWorkflow("send_email", { to:eachUserId,sub: ticket_name,body: body_content,
    })
    console.log("finalticketData------->",finalticketData)

    // // Post data to API to add new ticket entry
    // domo.post(`/domo/datastores/v1/collections/Ticketing_tool/documents`, finalticketData)
    //   .then(response => {
    //     console.log(response);
    //   })

    if (editId) {
      // Editing existing ticket
      domo.put(`/domo/datastores/v1/collections/Ticketing_tool/documents/${editId}`, finalticketData)
        .then(response => {
          console.log("Ticket updated:", response);
          fetchDisplayTicket(); // Refresh the ticket list
          ticket_submit.removeAttribute("data-edit-id"); // Clear the edit flag
  
          create_ticket_details.style.display = 'none';
          manage_ticket_details.style.display = 'block';
        })
        .catch(error => {
          console.error("Failed to update ticket:", error);
          alert("Failed to update ticket. Please try again.");
        });
    } else {
      // Creating new ticket
      domo.post('/domo/datastores/v1/collections/Ticketing_tool/documents', finalticketData)
        .then(response => {
          console.log("Ticket created:", response);
          fetchDisplayTicket(); // Refresh the ticket list
        })
        .catch(error => {
          console.error("Failed to create ticket:", error);
          alert("Failed to create ticket. Please try again.");
        });
    }
  
    // Clear input fields
    document.getElementById("select-drop-list").value = "";
    document.getElementById("ticket-name").value = "";
    document.getElementById("ticket-details").value = "";
  
    // Show notification
    const t_notification = document.getElementById("notification_ticket");
    t_notification.classList.add("show");
    setTimeout(() => {
      t_notification.classList.remove("show");
    },3000);
  });

