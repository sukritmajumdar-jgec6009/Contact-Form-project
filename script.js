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

        const name = FullName.value.trim();
        const mobile = PhoneNumber.value.trim();
        const email = SenderEmail.value.trim();
        const receiver = ReceiverEmail.value.trim();
        const message = MessageText.value.trim();

        // checking if any field is empty
        if (
            name === "" ||
            mobile === "" ||
            email === "" ||
            message === ""
        ) {
            alert("Please fill all fields.");
            return;
        }

        // Mobile validation: only digits and exactly 10 digits
        if (!/^\d{10}$/.test(mobile)) {
            alert(
                "Please enter a valid 10-digit mobile number."
            );
            return;
        }

        // Sender email validation
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            alert("Please enter a valid sender email address.");
            return;
        }

        // Receiver email validation (only if user entered with correct format one)
        if (
            receiver !== "" &&
            !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(receiver)
        ) {
            alert("Please enter a valid receiver email address.");
            return;
        }

        emailjs.send(
            "service_kkb2dm8",
            "template_mhks648",
            {
                name: name,
                mobile: mobile,
                email: email,
                // to_email: receiver,
                message: message
            }
        )
        .then(() => {
            alert("Email Sent.");
        })
        .catch((error) => {
            console.log(error);
            alert("Email failed.");
        });

        const contact = {
            id: Date.now(),
            name: name,
            mobile: mobile,
            email: email,
            receiver: receiver,
            message: message
        };

        contacts.push(contact);
        saveContacts();
        renderContacts();

        FullName.value = "";
        PhoneNumber.value = "";
        SenderEmail.value = "";
        ReceiverEmail.value = "";
        MessageText.value = "";
    });

    function saveContacts() {
        localStorage.setItem(
            "contacts",
            JSON.stringify(contacts)
        );
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

            const deleteBtn =
                div.querySelector(".delete-btn");
            const editBtn =
                div.querySelector(".edit-btn");

            deleteBtn.addEventListener("click", () => {
                contacts = contacts.filter(
                    c => c.id !== contact.id
                );
                saveContacts();
                renderContacts();
            });

            editBtn.addEventListener("click", () => {
                FullName.value = contact.name;
                PhoneNumber.value = contact.mobile;
                SenderEmail.value = contact.email;
                ReceiverEmail.value =
                    contact.receiver;
                MessageText.value = contact.message;

                contacts = contacts.filter(
                    c => c.id !== contact.id
                );
                saveContacts();
                renderContacts();
            });

            Messages.appendChild(div);
        });
    }
});
