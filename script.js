document.addEventListener('DOMContentLoaded', () => {
const FullName = document.getElementById("name");
const PhoneNumber = document.getElementById("mobile");
const SenderEmail = document.getElementById("sender-email");
const ReceiverEmail = document.getElementById("receiver-email");
const MessageText = document.getElementById("message");
const SubmitButton = document.getElementById("submit-btn");
const Messages = document.getElementById("messages");


emailjs.init("yP3_QNh1zabqgz0EW");

let contacts = JSON.parse(localStorage.getItem("contacts")) || [];

renderContacts();

SubmitButton.addEventListener('click', (e) => {
    e.preventDefault();

    if (
        FullName.value.trim() === "" ||
        PhoneNumber.value.trim() === "" ||
        SenderEmail.value.trim() === "" ||
        MessageText.value.trim() === ""
    ) {
        alert("Please fill all fields.");
        return;
    }

    
    emailjs.send("service_kkb2dm8", "template_mhks648", {
        name: FullName.value.trim(),
        mobile: PhoneNumber.value.trim(),
        email: SenderEmail.value.trim(),
        //to_email: ReceiverEmail.value,
        message: MessageText.value.trim()
    })
    .then(() => {
        alert("Email Sent.");
    })
    .catch((error) => {
        console.log(error);
        alert("Email failed.");
    });

    const contact = {
        id: Date.now(),
        name: FullName.value.trim(),
        mobile: PhoneNumber.value.trim(),
        email: SenderEmail.value.trim(),
        receiver:ReceiverEmail.value.trim(),
        message: MessageText.value.trim()
    };

    contacts.push(contact);
    saveContacts();
    renderContacts();

    FullName.value = "";
    PhoneNumber.value = "";
    SenderEmail.value = "";
    MessageText.value = "";
});

function saveContacts() {
    localStorage.setItem("contacts", JSON.stringify(contacts));
}

function renderContacts() {
    Messages.innerHTML = "";

    contacts.forEach(contact => {
        const div = document.createElement("div");

        div.innerHTML = `
            <h3>From : ${contact.name}</h3>
            <p>Sender's Phone number: ${contact.mobile}</p>
            <p>Sender's Email : ${contact.email}</p>
            <p>Receiver's Email : ${contact.receiver}</p>
            <p>Message : ${contact.message}</p>
            <button class="edit-btn">Edit</button>
            <button class="delete-btn">Delete</button>
        `;

        const deleteBtn = div.querySelector(".delete-btn");
        const editBtn = div.querySelector(".edit-btn");

        deleteBtn.addEventListener("click", () => {
            contacts = contacts.filter(c => c.id !== contact.id);
            saveContacts();
            renderContacts();
        });

        editBtn.addEventListener("click", () => {
            FullName.value = contact.name;
            PhoneNumber.value = contact.mobile;
            SenderEmail.value = contact.email;
            MessageText.value = contact.message;

            contacts = contacts.filter(c => c.id !== contact.id);
            saveContacts();
            renderContacts();
        });

        Messages.appendChild(div);
    });
}
});