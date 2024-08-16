let appointmentList = [];

document.addEventListener('DOMContentLoaded', async () => {
    // Checking token expiration on page load
    checkTokenExpiration();

    const token = localStorage.getItem('token');
    if (!token) {
        window.location.href = 'login.html';
        return;
    }

    await loadAppointmentTypes();
    await loadAppointmentStatuses();
    await loadStaffList();
    await loadClientList();

    document.getElementById('logoutButton').addEventListener('click', (event) => {
        event.preventDefault(); // Preventing default behavior
        logoutUser(); // Calling the logout function
    });

    // Setting an interval to check token expiration every minute
    setInterval(checkTokenExpiration, 60000);
});

// Function to handle token expiration and logout
function checkTokenExpiration() {
    const token = localStorage.getItem('token');
    if (!token) {
        logoutUser();
        return;
    }

    try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        const expirationTime = payload.exp * 1000;
        const currentTime = Date.now();

        if (currentTime >= expirationTime) {
            logoutUser();
        }
    } catch (e) {
        console.error('Invalid token format', e);
        logoutUser();
    }
}

// Function to log out the user with a loading spinner
async function logoutUser() {
    // Showing the loading spinner
    document.getElementById('loading').style.display = 'flex';

    try {
        // Removing tokens from localStorage
        localStorage.removeItem('token');
        localStorage.removeItem('refreshToken');

        // Attempting to call the logout API
        await fetch('https://appointment-management-da90d3c8d8ca.herokuapp.com/security/logout', {
            method: 'POST'
        });

    } catch (error) {
        console.error('Error during logout:', error);
    } finally {
        // Redirecting to the login page
        window.location.href = 'login.html';
    }
}

// Adding beforeunload event to ensure proper logout when the user leaves the page
window.addEventListener('beforeunload', checkTokenExpiration);

async function loadAppointmentTypes() {
    try {
            const response = await fetch('https://appointment-management-da90d3c8d8ca.herokuapp.com/appointment/fetchAllAppointmentType', {
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
        });
        if (response.ok) {
            const types = await response.json();
            const typeSelectCreate = document.getElementById('createAppointmentType');
            const typeSelectEdit = document.getElementById('editAppointmentType');
            const typeFilter = document.getElementById('appointmentTypeFilter');
            types.forEach(type => {
                const option = document.createElement('option');
                option.value = type;
                option.textContent = type;
                typeSelectCreate.appendChild(option.cloneNode(true));
                typeSelectEdit.appendChild(option.cloneNode(true));
                typeFilter.appendChild(option.cloneNode(true));
            });
        } else {
            console.error('Failed to load appointment types');
        }
    } catch (error) {
        console.error('Error loading appointment types:', error);
    }
}

async function loadAppointmentStatuses() {
    try {
            const response = await fetch('https://appointment-management-da90d3c8d8ca.herokuapp.com/appointment/fetchAllAppointmentStatus', {
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
        });
        if (response.ok) {
            const statuses = await response.json();
            const statusSelectCreate = document.getElementById('createAppointmentStatus');
            const statusSelectEdit = document.getElementById('editAppointmentStatus');
            const statusFilter = document.getElementById('appointmentStatusFilter');
            statuses.forEach(status => {
                const option = document.createElement('option');
                option.value = status;
                option.textContent = status;
                statusSelectCreate.appendChild(option.cloneNode(true));
                statusSelectEdit.appendChild(option.cloneNode(true));
                statusFilter.appendChild(option.cloneNode(true));
            });
        } else {
            console.error('Failed to load appointment statuses');
        }
    } catch (error) {
        console.error('Error loading appointment statuses:', error);
    }
}

// Function to load the list of clients
async function loadClientList() {
    try {
        const response = await fetch('https://appointment-management-da90d3c8d8ca.herokuapp.com/client/fetchAllClients', {
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
        });
        if (response.ok) {
            const clientList = await response.json();
            const clientSelectCreate = document.getElementById('createAppointmentClientId');
            const clientSelectEdit = document.getElementById('editAppointmentClientId');
            clientList.forEach(client => {
                const option = document.createElement('option');
                option.value = client.clientId;
                option.textContent = `${client.clientId} - ${client.name}`;
                clientSelectCreate.appendChild(option.cloneNode(true));
                clientSelectEdit.appendChild(option.cloneNode(true));
            });
        } else {
            console.error('Failed to load client list');
        }
    } catch (error) {
        console.error('Error loading client list:', error);
    }
}

async function loadStaffList() {
    try {
            const response = await fetch('https://appointment-management-da90d3c8d8ca.herokuapp.com/staff/fetchAllStaff', {
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
        });
        if (response.ok) {
            const staffList = await response.json();
            const staffSelectCreate = document.getElementById('createAppointmentStaffId');
            const staffSelectEdit = document.getElementById('editAppointmentStaffId');
            staffList.forEach(staff => {
                const option = document.createElement('option');
                option.value = staff.staffId;
                option.textContent = `${staff.staffId} - ${staff.name}`;
                staffSelectCreate.appendChild(option.cloneNode(true));
                staffSelectEdit.appendChild(option.cloneNode(true));
            });
        } else {
            console.error('Failed to load staff list');
        }
    } catch (error) {
        console.error('Error loading staff list:', error);
    }
}

function handleDataTypeChange() {
    const dataType = document.getElementById('dataType').value;
    const appointmentIdType = document.getElementById('appointmentIdType');
    const dataId = document.getElementById('dataId');
    const appointmentSelection = document.getElementById('appointmentSelection');
    const appointmentNumber = document.getElementById('appointmentNumber');
    const appointmentListType = document.getElementById('appointmentListType');
    const singleDate = document.getElementById('singleDate');
    const startDate = document.getElementById('startDate');
    const endDate = document.getElementById('endDate');
    const appointmentStatusFilter = document.getElementById('appointmentStatusFilter');
    const appointmentTypeFilter = document.getElementById('appointmentTypeFilter');

    appointmentIdType.style.display = 'none';
    dataId.style.display = 'none';
    appointmentSelection.style.display = 'none';
    appointmentNumber.style.display = 'none';
    appointmentListType.style.display = 'none';
    singleDate.style.display = 'none';
    startDate.style.display = 'none';
    endDate.style.display = 'none';
    appointmentStatusFilter.style.display = 'none';
    appointmentTypeFilter.style.display = 'none';

    if (dataType === 'client' || dataType === 'staff') {
        appointmentIdType.style.display = 'inline-block';
        dataId.style.display = 'inline-block';
        handleAppointmentIdTypeChange();
    } else if (dataType === 'appointment') {
        appointmentSelection.style.display = 'inline-block';
        handleAppointmentSelectionChange();
    }
}

function handleAppointmentIdTypeChange() {
    const appointmentIdType = document.getElementById('appointmentIdType').value;
    const dataId = document.getElementById('dataId');

    if (appointmentIdType === 'email') {
        dataId.placeholder = 'Enter Email';
    } else if (appointmentIdType === 'phone') {
        dataId.placeholder = 'Enter Phone Number';
    } else if (appointmentIdType === 'id'){
        dataId.placeholder = 'Enter ID';
    } else {
        dataId.style.display = "none";
    }
}

function handleAppointmentSelectionChange() {
    const appointmentSelection = document.getElementById('appointmentSelection').value;
    const appointmentNumber = document.getElementById('appointmentNumber');
    const appointmentListType = document.getElementById('appointmentListType');
    const singleDate = document.getElementById('singleDate');
    const startDate = document.getElementById('startDate');
    const endDate = document.getElementById('endDate');
    const appointmentStatusFilter = document.getElementById('appointmentStatusFilter');
    const appointmentTypeFilter = document.getElementById('appointmentTypeFilter');

    appointmentNumber.style.display = 'none';
    appointmentListType.style.display = 'none';
    singleDate.style.display = 'none';
    startDate.style.display = 'none';
    endDate.style.display = 'none';
    appointmentStatusFilter.style.display = 'none';
    appointmentTypeFilter.style.display = 'none';

    if (appointmentSelection === 'single') {
        appointmentNumber.style.display = 'inline-block';
    } else if (appointmentSelection === 'list') {
        appointmentListType.style.display = 'inline-block';
        handleAppointmentListTypeChange();
    }
}

function handleAppointmentListTypeChange() {
    const appointmentListType = document.getElementById('appointmentListType').value;
    const singleDate = document.getElementById('singleDate');
    const startDate = document.getElementById('startDate');
    const endDate = document.getElementById('endDate');
    const appointmentStatusFilter = document.getElementById('appointmentStatusFilter');
    const appointmentTypeFilter = document.getElementById('appointmentTypeFilter');

    singleDate.style.display = 'none';
    startDate.style.display = 'none';
    endDate.style.display = 'none';
    appointmentStatusFilter.style.display = 'none';
    appointmentTypeFilter.style.display = 'none';

    if (appointmentListType === 'singleDate') {
        singleDate.style.display = 'inline-block';
    } else if (appointmentListType === 'doubleDate') {
        startDate.style.display = 'inline-block';
        endDate.style.display = 'inline-block';
    } else if (appointmentListType === 'doubleDate') {
        startDate.style.display = 'inline-block';
        endDate.style.display = 'inline-block';
    } else if (appointmentListType === 'status') {
        appointmentStatusFilter.style.display = 'inline-block';
    } else if (appointmentListType === 'type') {
        appointmentTypeFilter.style.display = 'inline-block';
    } else if (appointmentListType === 'typeAndSingleDate') {
        appointmentTypeFilter.style.display = 'inline-block';
        singleDate.style.display = 'inline-block';
    } else if (appointmentListType === 'typeAndDoubleDate') {
        appointmentTypeFilter.style.display = 'inline-block';
        startDate.style.display = 'inline-block';
        endDate.style.display = 'inline-block';
    } else if (appointmentListType === 'statusAndSingleDate') {
        appointmentStatusFilter.style.display = 'inline-block';
        singleDate.style.display = 'inline-block';
    } else if (appointmentListType === 'statusAndDoubleDate') {
        appointmentStatusFilter.style.display = 'inline-block';
        startDate.style.display = 'inline-block';
        endDate.style.display = 'inline-block';
    } else if (appointmentListType === 'statusForToday') {
        appointmentStatusFilter.style.display = 'inline-block';
    } else if (appointmentListType === 'typeForToday') {
        appointmentTypeFilter.style.display = 'inline-block';
    } else if (appointmentListType === 'statusAndType') {
        appointmentStatusFilter.style.display = 'inline-block';
        appointmentTypeFilter.style.display = 'inline-block';
    }
}

function displayClientDetails(client) {
    const clientDetails = document.getElementById('clientDetails');
    const clientName = document.getElementById('clientName');
    const clientEmail = document.getElementById('clientEmail');
    const clientPhoneNumber = document.getElementById('clientPhoneNumber');
    const clientStreetAddress = document.getElementById('clientStreetAddress');
    const clientCity = document.getElementById('clientCity');
    const clientState = document.getElementById('clientState');
    const clientPostalCode = document.getElementById('clientPostalCode');
    const clientCreatedAt = document.getElementById('clientCreatedAt');
    const clientUpdatedAt = document.getElementById('clientUpdatedAt');
    const clientId = document.getElementById('clientID');

    clientDetails.style.display = 'block';
    clientId.textContent = client.clientId;
    clientName.textContent = client.name;
    clientEmail.textContent = client.email;
    clientPhoneNumber.textContent = client.phoneNumber;
    if (client.clientAddressDTO) {
        clientStreetAddress.textContent = client.clientAddressDTO.streetAddress || 'N/A';
        clientCity.textContent = client.clientAddressDTO.city || 'N/A';
        clientState.textContent = client.clientAddressDTO.state || 'N/A';
        clientPostalCode.textContent = client.clientAddressDTO.postalCode || 'N/A';
    } else {
        clientStreetAddress.textContent = 'N/A';
        clientCity.textContent = 'N/A';
        clientState.textContent = 'N/A';
        clientPostalCode.textContent = 'N/A';
    }
    clientCreatedAt.textContent = new Date(client.createdAt).toLocaleString();
    clientUpdatedAt.textContent = client.updatedAt ? new Date(client.updatedAt).toLocaleString() : 'N/A';

    document.getElementById('editClientID').value = client.clientId;
    document.getElementById('editClientName').value = client.name;
    document.getElementById('editClientEmail').value = client.email;
    document.getElementById('editClientPhoneNumber').value = client.phoneNumber;
    if (client.clientAddressDTO) {
        document.getElementById('editClientStreetAddress').value = client.clientAddressDTO.streetAddress || '';
        document.getElementById('editClientCity').value = client.clientAddressDTO.city || '';
        document.getElementById('editClientState').value = client.clientAddressDTO.state || '';
        document.getElementById('editClientPostalCode').value = client.clientAddressDTO.postalCode || '';
    } else {
        document.getElementById('editClientStreetAddress').value = '';
        document.getElementById('editClientCity').value = '';
        document.getElementById('editClientState').value = '';
        document.getElementById('editClientPostalCode').value = '';
    }
    fetchAppointments('clientId', client.clientId);
}

function displayStaffDetails(staff) {
    const clientDetails = document.getElementById('clientDetails');
    const staffDetails = document.getElementById('staffDetails');

    clientDetails.style.display = 'none';
    staffDetails.style.display = 'block';

    const staffID = document.getElementById('staffID');
    const staffName = document.getElementById('staffName');
    const staffEmail = document.getElementById('staffEmail');
    const staffPhoneNumber = document.getElementById('staffPhoneNumber');
    const staffStreetAddress = document.getElementById('staffStreetAddress');
    const staffCity = document.getElementById('staffCity');
    const staffState = document.getElementById('staffState');
    const staffPostalCode = document.getElementById('staffPostalCode');
    const staffCreatedAt = document.getElementById('staffCreatedAt');
    const staffUpdatedAt = document.getElementById('staffUpdatedAt');

    staffID.textContent = staff.staffId;
    staffName.textContent = staff.name;
    staffEmail.textContent = staff.email;
    staffPhoneNumber.textContent = staff.phoneNumber;
    if (staff.staffAddressDTO) {
        staffStreetAddress.textContent = staff.staffAddressDTO.streetAddress || 'N/A';
        staffCity.textContent = staff.staffAddressDTO.city || 'N/A';
        staffState.textContent = staff.staffAddressDTO.state || 'N/A';
        staffPostalCode.textContent = staff.staffAddressDTO.postalCode || 'N/A';
    } else {
        staffStreetAddress.textContent = 'N/A';
        staffCity.textContent = 'N/A';
        staffState.textContent = 'N/A';
        staffPostalCode.textContent = 'N/A';
    }
    staffCreatedAt.textContent = new Date(staff.createdAt).toLocaleString();
    staffUpdatedAt.textContent = staff.updatedAt ? new Date(staff.updatedAt).toLocaleString() : 'N/A';

    document.getElementById('editStaffID').value = staff.staffId;
    document.getElementById('editStaffName').value = staff.name;
    document.getElementById('editStaffEmail').value = staff.email;
    document.getElementById('editStaffPhoneNumber').value = staff.phoneNumber;
    if (staff.staffAddressDTO) {
        document.getElementById('editStaffStreetAddress').value = staff.staffAddressDTO.streetAddress || '';
        document.getElementById('editStaffCity').value = staff.staffAddressDTO.city || '';
        document.getElementById('editStaffState').value = staff.staffAddressDTO.state || '';
        document.getElementById('editStaffPostalCode').value = staff.staffAddressDTO.postalCode || '';
    } else {
        document.getElementById('editStaffStreetAddress').value = '';
        document.getElementById('editStaffCity').value = '';
        document.getElementById('editStaffState').value = '';
        document.getElementById('editStaffPostalCode').value = '';
    }
    fetchAppointments('staffId', staff.staffId);
}

async function fetchAppointments(type, id) {
    let apiUrl = '';
    if (type === 'clientId') {
        apiUrl = `https://appointment-management-da90d3c8d8ca.herokuapp.com/appointment/fetchByClientId?clientId=${id}`;
    } else if (type === 'staffId') {
        apiUrl = `https://appointment-management-da90d3c8d8ca.herokuapp.com/appointment/fetchByStaffId?staffId=${id}`;
    }

    try {
        const response = await fetch(apiUrl, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
        });
        if (!response.ok) {
            throw new Error(`Failed to fetch appointments: ${response.status} ${response.statusText}`);
        }
        const appointments = await response.json();
        appointmentList = appointments;
        displayAppointmentList(appointments, type);
    } catch (error) {
        console.error(`Error fetching appointments:`, error);
        alert(`An error occurred while fetching the appointments`);
    }
}

function displayAppointmentDetails(appointment) {
    const appointmentDetails = document.getElementById('appointmentDetails');
    appointmentDetails.style.display = 'block';

    appointmentDetails.innerHTML = `
        <p><strong>Appointment Number:</strong> ${appointment.appointmentNumber}</p>
        <p><strong>Client ID:</strong> ${appointment.clientId}</p>
        <p><strong>Assigned Staff ID:</strong> ${appointment.assignedStaffId}</p>
        <p><strong>Date and Time:</strong> ${new Date(appointment.appointmentDateTime).toLocaleString()}</p>
        <p><strong>Type:</strong> ${appointment.appointmentType || 'N/A'}</p>
        <p><strong>Status:</strong> ${appointment.appointmentStatus || 'N/A'}</p>
        <p><strong>Facility Name:</strong> ${appointment.appointmentAddressDTO ? appointment.appointmentAddressDTO.facilityName : 'N/A'}</p>
        <p><strong>Street Address:</strong> ${appointment.appointmentAddressDTO ? appointment.appointmentAddressDTO.streetAddress : 'N/A'}</p>
        <p><strong>City:</strong> ${appointment.appointmentAddressDTO ? appointment.appointmentAddressDTO.city : 'N/A'}</p>
        <p><strong>State:</strong> ${appointment.appointmentAddressDTO ? appointment.appointmentAddressDTO.state : 'N/A'}</p>
        <p><strong>Postal Code:</strong> ${appointment.appointmentAddressDTO ? appointment.appointmentAddressDTO.postalCode : 'N/A'}</p>
    `;
}

function displayAppointmentList(appointments, appointmentIdType) {
    const appointmentListContainer = document.getElementById('appointmentListContainer');
    const appointmentList = document.getElementById('appointmentList');
    const appointmentListTitle = document.getElementById('appointmentListTitle');
    const createAppointmentButton = document.getElementById('createAppointmentButton');

    appointmentList.style.display = 'block';
    appointmentListContainer.innerHTML = '';

    if (appointmentIdType === 'all' || appointmentIdType === 'singleDate' || 
        appointmentIdType === 'doubleDate' || appointmentIdType === 'status' || 
        appointmentIdType === 'type' || appointmentIdType === 'today' || 
        appointmentIdType === 'typeAndSingleDate' || appointmentIdType === 'typeAndDoubleDate' || 
        appointmentIdType === 'statusAndSingleDate' || appointmentIdType === 'statusAndDoubleDate' || 
        appointmentIdType === 'statusForToday' || appointmentIdType === 'typeForToday' || 
        appointmentIdType === 'statusAndType') {
        createAppointmentButton.style.display = 'none';
    } else {
        createAppointmentButton.style.display = 'block';
    }

    if (appointments.length === 0) {
        alert('No appointments found');
        return;
    }

    let title = 'Appointments';
    if (appointmentIdType === 'status') {
        title = `Appointments`;
    } else if (appointmentIdType === 'singleDate') {
        title = `Appointments`;
    } else if (appointmentIdType === 'doubleDate') {
        title = `Appointments`;
    } else if (appointmentIdType === 'statusForToday') {
        title = title = `Appointments`;
    }
    appointmentListTitle.textContent = title;

    appointments.forEach(appointment => {
        const appointmentInfo = document.createElement('div');
        appointmentInfo.className = 'appointment-box';
        appointmentInfo.innerHTML = `
            <p><strong>Appointment Number:</strong> ${appointment.appointmentNumber}</p>
            ${appointmentIdType !== 'clientId' ? `<p><strong>Client ID:</strong> ${appointment.clientId}</p>` : ''}
            ${appointmentIdType !== 'staffId' ? `<p><strong>Assigned Staff ID:</strong> ${appointment.assignedStaffId}</p>` : ''}
            <p><strong>Date and Time:</strong> ${new Date(appointment.appointmentDateTime).toLocaleString()}</p>
            <p><strong>Type:</strong> ${appointment.appointmentType || 'N/A'}</p>
            <p><strong>Status:</strong> ${appointment.appointmentStatus || 'N/A'}</p>
            <p><strong>Facility Name:</strong> ${appointment.appointmentAddressDTO ? appointment.appointmentAddressDTO.facilityName : 'N/A'}</p>
            <p><strong>Street Address:</strong> ${appointment.appointmentAddressDTO ? appointment.appointmentAddressDTO.streetAddress : 'N/A'}</p>
            <p><strong>City:</strong> ${appointment.appointmentAddressDTO ? appointment.appointmentAddressDTO.city : 'N/A'}</p>
            <p><strong>State:</strong> ${appointment.appointmentAddressDTO ? appointment.appointmentAddressDTO.state : 'N/A'}</p>
            <p><strong>Postal Code:</strong> ${appointment.appointmentAddressDTO ? appointment.appointmentAddressDTO.postalCode : 'N/A'}</p>
            <button class="btn btn-edit" onclick="showEditFormAppointment(${appointment.appointmentNumber})">Edit</button>
            <button class="btn btn-delete" onclick="confirmDeleteAppointment(${appointment.appointmentNumber})">Delete</button>
        `;
        appointmentListContainer.appendChild(appointmentInfo);
        document.getElementById("form2").style.display="none";
    });
}

function showEditForm(type, id) {
    console.log("Type and ID:", type, id);  // Debug to check what is being passed

    document.getElementById("clientDetails").style.display = "none";
    document.getElementById("staffDetails").style.display = "none";
    document.getElementById("appointmentList").style.display = "none";
    document.getElementById("editClientForm").style.display = "none";
    document.getElementById("editStaffForm").style.display = "none";
    document.getElementById("editAppointmentForm").style.display = "none";
    document.getElementById("createAppointmentForm").style.display = "none";
    document.getElementById("appointmentDetails").style.display = "none";

    if (type === 'client') {
        fetchClientDetails(id);
    } else if (type === 'staff') {
        fetchStaffDetails(id);
    } else if (type === 'appointment') {
        fetchAppointmentDetails(id);
    }
}

async function fetchClientDetails(clientId) {
    try {
        const response = await fetch(`https://appointment-management-da90d3c8d8ca.herokuapp.com/client/fetch?clientId=${clientId}`, {
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
        });
        if (response.ok) {
            const client = await response.json();
            populateClientEditForm(client);
        } else {
            console.error('Failed to fetch client details');
        }
    } catch (error) {
        console.error('Error fetching client details:', error);
    }
}

function populateClientEditForm(client) {
    document.getElementById('editClientID').value = client.clientId;
    document.getElementById('editClientName').value = client.name;
    document.getElementById('editClientEmail').value = client.email;
    document.getElementById('editClientPhoneNumber').value = client.phoneNumber;
    if (client.clientAddressDTO) {
        document.getElementById('editClientStreetAddress').value = client.clientAddressDTO.streetAddress || '';
        document.getElementById('editClientCity').value = client.clientAddressDTO.city || '';
        document.getElementById('editClientState').value = client.clientAddressDTO.state || '';
        document.getElementById('editClientPostalCode').value = client.clientAddressDTO.postalCode || '';
    } else {
        document.getElementById('editClientStreetAddress').value = '';
        document.getElementById('editClientCity').value = '';
        document.getElementById('editClientState').value = '';
        document.getElementById('editClientPostalCode').value = '';
    }
    document.getElementById('editClientForm').style.display = 'block';
}

async function fetchStaffDetails(staffId) {
    try {
        const response = await fetch(`https://appointment-management-da90d3c8d8ca.herokuapp.com/staff/fetch?staffId=${staffId}`, {
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
        });
        if (response.ok) {
            const staff = await response.json();
            populateStaffEditForm(staff);
        } else {
            console.error('Failed to fetch staff details');
        }
    } catch (error) {
        console.error('Error fetching staff details:', error);
    }
}

function populateStaffEditForm(staff) {
    document.getElementById('editStaffID').value = staff.staffId;
    document.getElementById('editStaffName').value = staff.name;
    document.getElementById('editStaffEmail').value = staff.email;
    document.getElementById('editStaffPhoneNumber').value = staff.phoneNumber;
    if (staff.staffAddressDTO) {
        document.getElementById('editStaffStreetAddress').value = staff.staffAddressDTO.streetAddress || '';
        document.getElementById('editStaffCity').value = staff.staffAddressDTO.city || '';
        document.getElementById('editStaffState').value = staff.staffAddressDTO.state || '';
        document.getElementById('editStaffPostalCode').value = staff.staffAddressDTO.postalCode || '';
    } else {
        document.getElementById('editStaffStreetAddress').value = '';
        document.getElementById('editStaffCity').value = '';
        document.getElementById('editStaffState').value = '';
        document.getElementById('editStaffPostalCode').value = '';
    }
    document.getElementById('editStaffForm').style.display = 'block';
}

async function fetchData() {
    const dataType = document.getElementById('dataType').value;
    const appointmentIdType = document.getElementById('appointmentIdType').value;
    const dataId = document.getElementById('dataId').value;
    const appointmentSelection = document.getElementById('appointmentSelection').value;
    const appointmentNumber = document.getElementById('appointmentNumber').value;
    const appointmentListType = document.getElementById('appointmentListType').value;
    const singleDate = document.getElementById('singleDate').value;
    const startDate = document.getElementById('startDate').value;
    const endDate = document.getElementById('endDate').value;
    const appointmentStatus = document.getElementById('appointmentStatusFilter').value;
    const appointmentType = document.getElementById('appointmentTypeFilter').value;
    let apiUrl = '';

    const loadingOverlay = document.getElementById('loading');
    if (loadingOverlay) {
        loadingOverlay.style.display = 'flex';
    }

    let showCreateButton = false;

    if (dataType === 'client') {
        if (appointmentIdType === 'id') {
            apiUrl = `https://appointment-management-da90d3c8d8ca.herokuapp.com/client/fetch?clientId=${dataId}`;
        } else if (appointmentIdType === 'email') {
            apiUrl = `https://appointment-management-da90d3c8d8ca.herokuapp.com/client/fetchClientByEmail?email=${dataId}`;
        } else if (appointmentIdType === 'phone') {
            apiUrl = `https://appointment-management-da90d3c8d8ca.herokuapp.com/client/fetchClientByPhoneNumber?phoneNumber=${dataId}`;
        } else if (appointmentIdType === 'all') {
            apiUrl = `https://appointment-management-da90d3c8d8ca.herokuapp.com/client/fetchAllClients`;
        }
        showCreateButton = true; // Show create button for client data
    } else if (dataType === 'staff') {
        if (appointmentIdType === 'id') {
            apiUrl = `https://appointment-management-da90d3c8d8ca.herokuapp.com/staff/fetch?staffId=${dataId}`;
        } else if (appointmentIdType === 'email') {
            apiUrl = `https://appointment-management-da90d3c8d8ca.herokuapp.com/staff/fetchStaffByEmail?email=${dataId}`;
        } else if (appointmentIdType === 'phone') {
            apiUrl = `https://appointment-management-da90d3c8d8ca.herokuapp.com/staff/fetchStaffByPhoneNumber?phoneNumber=${dataId}`;
        } else if (appointmentIdType === 'all') {
            apiUrl = `https://appointment-management-da90d3c8d8ca.herokuapp.com/staff/fetchAllStaff`;
        }
    } else if (dataType === 'appointment') {
        if (appointmentSelection === 'single') {
            apiUrl = `https://appointment-management-da90d3c8d8ca.herokuapp.com/appointment/fetch?appointmentNumber=${appointmentNumber}`;
        } else if (appointmentSelection === 'list') {
            if (appointmentListType === 'all') {
                apiUrl = `https://appointment-management-da90d3c8d8ca.herokuapp.com/appointment/fetchAllAppointments`;
            } else if (appointmentListType === 'singleDate') {
                apiUrl = `https://appointment-management-da90d3c8d8ca.herokuapp.com/appointment/fetchAppointmentsBySingleDate?date=${singleDate}`;
            } else if (appointmentListType === 'doubleDate') {
                apiUrl = `https://appointment-management-da90d3c8d8ca.herokuapp.com/appointment/fetchAppointmentsByDoubleDates?date1=${startDate}&date2=${endDate}`;
            } else if (appointmentListType === 'status') {
                apiUrl = `https://appointment-management-da90d3c8d8ca.herokuapp.com/appointment/fetchAppointmentsByAppointmentStatus?appointmentStatus=${appointmentStatus}`;
            } else if (appointmentListType === 'type') {
                apiUrl = `https://appointment-management-da90d3c8d8ca.herokuapp.com/appointment/fetchAppointmentsByAppointmentType?appointmentType=${appointmentType}`;
            } else if (appointmentListType === 'today') {
                apiUrl = `https://appointment-management-da90d3c8d8ca.herokuapp.com/appointment/fetchAppointmentsForToday`;
            } else if (appointmentListType === 'typeAndSingleDate') {
                apiUrl = `https://appointment-management-da90d3c8d8ca.herokuapp.com/appointment/fetchAppointmentsByAppointmentTypeAndSingleDate?appointmentType=${appointmentType}&date=${singleDate}`;
            } else if (appointmentListType === 'typeAndDoubleDate') {
                apiUrl = `https://appointment-management-da90d3c8d8ca.herokuapp.com/appointment/fetchAppointmentsByAppointmentTypeAndDoubleDates?appointmentType=${appointmentType}&date1=${startDate}&date2=${endDate}`;
            } else if (appointmentListType === 'statusAndSingleDate') {
                apiUrl = `https://appointment-management-da90d3c8d8ca.herokuapp.com/appointment/fetchAppointmentsByAppointmentStatusAndSingleDate?appointmentStatus=${appointmentStatus}&date=${singleDate}`;
            } else if (appointmentListType === 'statusAndDoubleDate') {
                apiUrl = `https://appointment-management-da90d3c8d8ca.herokuapp.com/appointment/fetchAppointmentsByAppointmentStatusAndDoubleDates?appointmentStatus=${appointmentStatus}&date1=${startDate}&date2=${endDate}`;
            } else if (appointmentListType === 'statusForToday') {
                apiUrl = `https://appointment-management-da90d3c8d8ca.herokuapp.com/appointment/fetchAppointmentsByStatusForToday?appointmentStatus=${appointmentStatus}`;
            } else if (appointmentListType === 'typeForToday') {
                apiUrl = `https://appointment-management-da90d3c8d8ca.herokuapp.com/appointment/fetchAppointmentsByTypeForToday?appointmentType=${appointmentType}`;
            } else if (appointmentListType === 'statusAndType') {
                apiUrl = `https://appointment-management-da90d3c8d8ca.herokuapp.com/appointment/fetchAppointmentsByStatusAndTypeForToday?appointmentStatus=${appointmentStatus}&appointmentType=${appointmentType}`;
            }
        }
    }

    try {
        const response = await fetch(apiUrl, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
        });

        if (!response.ok) {
            throw new Error(`Error fetching data: ${response.statusText}`);
        }

        const data = await response.json();
        console.log('Fetched data:', data);
        displayData(data, dataType, showCreateButton);
    } catch (error) {
        console.error('Error fetching data:', error);
        document.getElementById('errorMessage').style.display = 'block';
    } finally {
        if (loadingOverlay) {
            loadingOverlay.style.display = 'none';
        }
    }
}

function displayData(data, dataType, showCreateButton) {
    if (dataType === 'client') {
        if (Array.isArray(data)) {
            displayClientList(data);
        } else {
            displayClientDetails(data);
        }
    } else if (dataType === 'staff') {
        if (Array.isArray(data)) {
            displayStaffList(data);
        } else {
            displayStaffDetails(data);
        }
    } else if (dataType === 'appointment') {
        if (Array.isArray(data)) {
            displayAppointmentList(data, showCreateButton);
        } else {
            displayAppointmentDetails(data);
        }
    }
}


function displayClientList(clients) {
    const clientListContainer = document.getElementById('clientListContainer');
    clientListContainer.innerHTML = ''; // Clear previous data
    clients.forEach(client => {
        const clientInfo = document.createElement('div');
        clientInfo.className = 'client-box';
        clientInfo.innerHTML = `
            <p><strong>Client ID:</strong> ${client.clientId}</p>
            <p><strong>Name:</strong> ${client.name}</p>
            <p><strong>Email:</strong> ${client.email}</p>
            <p><strong>Phone Number:</strong> ${client.phoneNumber}</p>
            <button class="btn btn-edit" onclick="showEditForm('client', '${client.clientId}')">Edit</button>
            <button class="btn btn-delete" onclick="confirmDelete('client', '${client.clientId}')">Delete</button>
        `;
        clientListContainer.appendChild(clientInfo);
    });
    document.getElementById('clientList').style.display = 'block'; // Show the client list
}

function displayStaffList(staffs) {
    const staffListContainer = document.getElementById('staffListContainer');
    staffListContainer.innerHTML = ''; // Clear previous data
    staffs.forEach(staff => {
        const staffInfo = document.createElement('div');
        staffInfo.className = 'staff-box';
        staffInfo.innerHTML = `
            <p><strong>Staff ID:</strong> ${staff.staffId}</p>
            <p><strong>Name:</strong> ${staff.name}</p>
            <p><strong>Email:</strong> ${staff.email}</p>
            <p><strong>Phone Number:</strong> ${staff.phoneNumber}</p>
            <button class="btn btn-edit" onclick="showEditForm('staff', ${staff.staffId})">Edit</button>
            <button class="btn btn-delete" onclick="confirmDelete('staff', ${staff.staffId})">Delete</button>
        `;
        staffListContainer.appendChild(staffInfo);
    });
    document.getElementById('staffList').style.display = 'block'; // Show the staff list
}

function displayAppointmentList(appointments, showCreateButton) {
    const appointmentListContainer = document.getElementById('appointmentListContainer');
    const appointmentList = document.getElementById('appointmentList');
    const appointmentListTitle = document.getElementById('appointmentListTitle');
    const createAppointmentButton = document.getElementById('createAppointmentButton');

    appointmentList.style.display = 'block';
    appointmentListContainer.innerHTML = '';

    createAppointmentButton.style.display = showCreateButton ? 'block' : 'none';

    if (appointments.length === 0) {
        alert('No appointments found');
        return;
    }

    let title = 'Appointments';
    appointmentListTitle.textContent = title;

    appointments.forEach(appointment => {
        const appointmentInfo = document.createElement('div');
        appointmentInfo.className = 'appointment-box';
        appointmentInfo.innerHTML = `
            <p><strong>Appointment Number:</strong> ${appointment.appointmentNumber}</p>
            <p><strong>Client ID:</strong> ${appointment.clientId}</p>
            <p><strong>Assigned Staff ID:</strong> ${appointment.assignedStaffId}</p>
            <p><strong>Date and Time:</strong> ${new Date(appointment.appointmentDateTime).toLocaleString()}</p>
            <p><strong>Type:</strong> ${appointment.appointmentType || 'N/A'}</p>
            <p><strong>Status:</strong> ${appointment.appointmentStatus || 'N/A'}</p>
            <p><strong>Facility Name:</strong> ${appointment.appointmentAddressDTO ? appointment.appointmentAddressDTO.facilityName : 'N/A'}</p>
            <p><strong>Street Address:</strong> ${appointment.appointmentAddressDTO ? appointment.appointmentAddressDTO.streetAddress : 'N/A'}</p>
            <p><strong>City:</strong> ${appointment.appointmentAddressDTO ? appointment.appointmentAddressDTO.city : 'N/A'}</p>
            <p><strong>State:</strong> ${appointment.appointmentAddressDTO ? appointment.appointmentAddressDTO.state : 'N/A'}</p>
            <p><strong>Postal Code:</strong> ${appointment.appointmentAddressDTO ? appointment.appointmentAddressDTO.postalCode : 'N/A'}</p>
            <button class="btn btn-edit" onclick="showEditFormAppointment(${appointment.appointmentNumber})">Edit</button>
            <button class="btn btn-delete" onclick="confirmDeleteAppointment(${appointment.appointmentNumber})">Delete</button>
        `;
        appointmentListContainer.appendChild(appointmentInfo);
        document.getElementById("form2").style.display="none";
    });

    window.appointmentList = appointments;
}

function showEditFormAppointment(appointmentNumber) {
    const appointment = window.appointmentList.find(a => a.appointmentNumber === appointmentNumber);
    if (appointment) {
        const form = document.querySelector('#editAppointmentFormElement');
        if (form && typeof form.reset === 'function') {
            form.reset();
        }

        document.getElementById('editAppointmentNumber').value = appointment.appointmentNumber;
        document.getElementById('editAppointmentClientId').value = appointment.clientId;
        document.getElementById('editAppointmentStaffId').value = appointment.assignedStaffId;
        document.getElementById('editAppointmentDateTime').value = new Date(appointment.appointmentDateTime).toISOString().slice(0, 16);
        document.getElementById('editAppointmentType').value = appointment.appointmentType || '';
        document.getElementById('editAppointmentStatus').value = appointment.appointmentStatus || '';
        document.getElementById('editAppointmentFacilityName').value = appointment.appointmentAddressDTO ? appointment.appointmentAddressDTO.facilityName : '';
        document.getElementById('editAppointmentStreetAddress').value = appointment.appointmentAddressDTO ? appointment.appointmentAddressDTO.streetAddress : '';
        document.getElementById('editAppointmentCity').value = appointment.appointmentAddressDTO ? appointment.appointmentAddressDTO.city : '';
        document.getElementById('editAppointmentState').value = appointment.appointmentAddressDTO ? appointment.appointmentAddressDTO.state : '';
        document.getElementById('editAppointmentPostalCode').value = appointment.appointmentAddressDTO ? appointment.appointmentAddressDTO.postalCode : '';

        document.getElementById("clientDetails").style.display = "none";
        document.getElementById("staffDetails").style.display = "none";
        document.getElementById("appointmentList").style.display = "none";
        document.getElementById("editClientForm").style.display = "none";
        document.getElementById("editStaffForm").style.display = "none";
        document.getElementById("createAppointmentForm").style.display = "none";
        document.getElementById("appointmentDetails").style.display = "none";
        document.getElementById('editAppointmentForm').style.display = 'block';
    }
}

async function updateClient() {
    const clientId = document.getElementById('editClientID').value;
    const clientName = document.getElementById('editClientName').value;
    const clientEmail = document.getElementById('editClientEmail').value;
    const clientPhoneNumber = document.getElementById('editClientPhoneNumber').value;
    const clientStreetAddress = document.getElementById('editClientStreetAddress').value;
    const clientCity = document.getElementById('editClientCity').value;
    const clientState = document.getElementById('editClientState').value;
    const clientPostalCode = document.getElementById('editClientPostalCode').value;

    const apiBaseUrlClient = 'https://appointment-management-da90d3c8d8ca.herokuapp.com/admin/client';

    const clientData = {
        clientId: clientId,
        name: clientName,
        email: clientEmail,
        phoneNumber: clientPhoneNumber,
        clientAddressDTO: {
            streetAddress: clientStreetAddress,
            city: clientCity,
            state: clientState,
            postalCode: clientPostalCode
        }
    };

    const loadingOverlay = document.getElementById('loading');
    if (loadingOverlay) {
        loadingOverlay.style.display = 'flex';
    }

    try {
        const response = await fetch(`${apiBaseUrlClient}/update`, {
            method: 'PUT',
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(clientData)
        });

        if (response.ok) {
            alert('Client updated successfully');
            closeModal('editClientForm');
            fetchData();
        } else {
            console.error('Failed to update client:', response.status, response.statusText);
            alert('Failed to update client');
        }
    } catch (error) {
        console.error('Error updating client:', error);
        alert('An error occurred while updating the client');
    } finally {
        if (loadingOverlay) {
            loadingOverlay.style.display = 'none';
        }
    }
}

async function updateStaff() {
    const staffId = document.getElementById('editStaffID').value;
    const staffName = document.getElementById('editStaffName').value;
    const staffEmail = document.getElementById('editStaffEmail').value;
    const staffPhoneNumber = document.getElementById('editStaffPhoneNumber').value;
    const staffStreetAddress = document.getElementById('editStaffStreetAddress').value;
    const staffCity = document.getElementById('editStaffCity').value;
    const staffState = document.getElementById('editStaffState').value;
    const staffPostalCode = document.getElementById('editStaffPostalCode').value;

    const apiBaseUrlStaff = 'https://appointment-management-da90d3c8d8ca.herokuapp.com/admin/staff';

    const staffData = {
        staffId: staffId,
        name: staffName,
        email: staffEmail,
        phoneNumber: staffPhoneNumber,
        staffAddressDTO: {
            streetAddress: staffStreetAddress,
            city: staffCity,
            state: staffState,
            postalCode: staffPostalCode
        }
    };

    const loadingOverlay = document.getElementById('loading');
    if (loadingOverlay) {
        loadingOverlay.style.display = 'flex';
    }
    try {
        const response = await fetch(`${apiBaseUrlStaff}/update`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            },
            body: JSON.stringify(staffData)
        });
    
        if (response.ok) {
            alert('Staff updated successfully');
            closeModal('editStaffForm');
            fetchData();
        } else {
            console.error('Failed to update staff:', response.status, response.statusText);
            alert('Failed to update staff');
        }
    } catch (error) {
        console.error('Error updating staff:', error);
        alert('An error occurred while updating the staff');
    } finally {
        if (loadingOverlay) {
            loadingOverlay.style.display = 'none';
        }
    }
    
}

async function updateAppointment() {
    const appointmentNumber = document.getElementById('editAppointmentNumber').value;
    const clientId = document.getElementById('editAppointmentClientId').value;
    const staffId = document.getElementById('editAppointmentStaffId').value;
    const appointmentDateTime = document.getElementById('editAppointmentDateTime').value;
    const appointmentType = document.getElementById('editAppointmentType').value;
    const appointmentStatus = document.getElementById('editAppointmentStatus').value;
    const appointmentFacilityName = document.getElementById('editAppointmentFacilityName').value;
    const appointmentStreetAddress = document.getElementById('editAppointmentStreetAddress').value;
    const appointmentCity = document.getElementById('editAppointmentCity').value;
    const appointmentState = document.getElementById('editAppointmentState').value;
    const appointmentPostalCode = document.getElementById('editAppointmentPostalCode').value;

    const apiBaseUrlAppointment = 'https://appointment-management-da90d3c8d8ca.herokuapp.com/admin/appointment';

    const appointmentData = {
        appointmentNumber: appointmentNumber,
        clientId: clientId,
        assignedStaffId: staffId,
        appointmentDateTime: appointmentDateTime,
        appointmentType: appointmentType,
        appointmentStatus: appointmentStatus,
        appointmentAddressDTO: {
            facilityName: appointmentFacilityName,
            streetAddress: appointmentStreetAddress,
            city: appointmentCity,
            state: appointmentState,
            postalCode: appointmentPostalCode
        }
    };

    const loadingOverlay = document.getElementById('loading');
    if (loadingOverlay) {
        loadingOverlay.style.display = 'flex';
    }

    try {
        const response = await fetch(`${apiBaseUrlAppointment}/update`, {
            method: 'PUT',
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(appointmentData)
        });

        if (response.ok) {
            alert('Appointment updated successfully');
            closeModal('editAppointmentForm');
            fetchData();
        } else {
            console.error('Failed to update appointment:', response.status, response.statusText);
            alert('Failed to update appointment');
        }
    } catch (error) {
        console.error('Error updating appointment:', error);
        alert('An error occurred while updating the appointment');
    } finally {
        if (loadingOverlay) {
            loadingOverlay.style.display = 'none';
        }
    }
}

function confirmDelete(type, id) {
    const confirmation = confirm(`Are you sure you want to delete this ${type} with ID ${id}?`);
    if (confirmation) {
        deleteData(type, id);
    }
}

function confirmDeleteAppointment(appointmentNumber) {
    const confirmation = confirm(`Are you sure you want to delete this appointment with number ${appointmentNumber}?`);
    if (confirmation) {
        deleteData('appointment', appointmentNumber);
    }
}

async function deleteData(type, id) {
    const apiBaseUrl = {
        client: `https://appointment-management-da90d3c8d8ca.herokuapp.com/admin/client/delete?clientId=${id}`,
        staff: `https://appointment-management-da90d3c8d8ca.herokuapp.com/admin/staff/delete?staffId=${id}`,
        appointment: `https://appointment-management-da90d3c8d8ca.herokuapp.com/admin/appointment/delete?appointmentNumber=${id}`
    };

    const loadingOverlay = document.getElementById('loading');
    if (loadingOverlay) {
        loadingOverlay.style.display = 'flex';
    }

    try {
        const response = await fetch(apiBaseUrl[type], {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
        });

        if (response.ok) {
            alert(`${type.charAt(0).toUpperCase() + type.slice(1)} deleted successfully`);
            document.getElementById(`${type}Details`).style.display = 'none';
            fetchData();
        } else {
            console.error(`Failed to delete ${type}:`, response.status, response.statusText);
            alert(`Failed to delete ${type}`);
        }
    } catch (error) {
        console.error(`Error deleting ${type}:`, error);
        alert(`An error occurred while deleting the ${type}`);
    } finally {
        if (loadingOverlay) {
            loadingOverlay.style.display = 'none';
        }
    }
}

// function showCreateAppointmentForm() {
//     const createForm = document.getElementById('createAppointmentForm');
//     const clientId = document.getElementById('clientID').textContent;
//     document.getElementById('createAppointmentClientId').value = clientId;
//     createForm.style.display = 'block';
//     document.getElementById("clientDetails").style.display="none";
//     document.getElementById("appointmentDetails").style.display="none";
//     document.getElementById("appointmentList").style.display="none";
// }

function showCreateAppointmentForm() {
    const createForm = document.getElementById('createAppointmentForm');
    const clientId = document.getElementById('clientID').textContent;
    document.getElementById('createAppointmentClientId').value = clientId;
    createForm.style.display = 'block';
    document.getElementById("clientDetails").style.display="none";
    document.getElementById("appointmentDetails").style.display="none";
    document.getElementById("appointmentList").style.display="none";
}

// Ensure loadClientList is properly fetching and populating the dropdown
async function loadClientList() {
    try {
        const response = await fetch('https://appointment-management-da90d3c8d8ca.herokuapp.com/client/fetchAllClients', {
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
        });
        if (response.ok) {
            const clientList = await response.json();
            const clientSelectCreate = document.getElementById('createAppointmentClientId');
            clientList.forEach(client => {
                const option = document.createElement('option');
                option.value = client.clientId;
                option.textContent = `${client.clientId} - ${client.name}`;
                clientSelectCreate.appendChild(option);
            });
        } else {
            console.error('Failed to load client list');
        }
    } catch (error) {
        console.error('Error loading client list:', error);
    }
}



async function createAppointment() {
    const clientId = document.getElementById('createAppointmentClientId').value;
    const staffId = document.getElementById('createAppointmentStaffId').value;
    const appointmentDateTime = document.getElementById('createAppointmentDateTime').value;
    const appointmentType = document.getElementById('createAppointmentType').value;
    const appointmentStatus = document.getElementById('createAppointmentStatus').value;
    const appointmentFacilityName = document.getElementById('createAppointmentFacilityName').value;
    const appointmentStreetAddress = document.getElementById('createAppointmentStreetAddress').value;
    const appointmentCity = document.getElementById('createAppointmentCity').value;
    const appointmentState = document.getElementById('createAppointmentState').value;
    const appointmentPostalCode = document.getElementById('createAppointmentPostalCode').value;

    const apiBaseUrlAppointment = 'https://appointment-management-da90d3c8d8ca.herokuapp.com/admin/appointment';

    const appointmentData = {
        clientId: clientId,
        assignedStaffId: staffId,
        appointmentDateTime: appointmentDateTime,
        appointmentType: appointmentType,
        appointmentStatus: appointmentStatus,
        appointmentAddressDTO: {
            facilityName: appointmentFacilityName,
            streetAddress: appointmentStreetAddress,
            city: appointmentCity,
            state: appointmentState,
            postalCode: appointmentPostalCode
        }
    };

    const loadingOverlay = document.getElementById('loading');
    if (loadingOverlay) {
        loadingOverlay.style.display = 'flex';
    }

    try {
        const response = await fetch(`${apiBaseUrlAppointment}/create`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(appointmentData)
        });

        if (response.ok) {
            alert('Appointment created successfully');
            closeModal('createAppointmentForm');
            fetchData();
        } else {
            console.error('Failed to create appointment:', response.status, response.statusText);
            alert('Failed to create appointment');
        }
    } catch (error) {
        console.error('Error creating appointment:', error);
        alert('An error occurred while creating the appointment');
    } finally {
        if (loadingOverlay) {
            loadingOverlay.style.display = 'none';
        }
    }
}

function closeModal(modalId) {
    const modal = document.getElementById(modalId);
    modal.style.display = 'none';
}