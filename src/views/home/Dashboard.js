import React, { useState, useEffect } from 'react';
import MUIDataTable from 'mui-datatables';
import axios from 'axios';
import {
  Button,
  Modal,
  TextField,
  Input,
  Container,
  Paper,
  Grid,
  MenuItem,
  Select,
  FormControl,
  InputLabel
} from '@mui/material';
import { toast, ToastContainer } from 'react-toastify';
import { IconButton,useMediaQuery } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
 
const Home = () => {
    const isSmallScreen = useMediaQuery('(max-width:600px)');
    const [data, setData] = useState([]);
    const [page, setPage] = useState(0);
    const [size, setsize] = useState(10);
    const [totalCount, setTotalCount] = useState(0);
    const [searchTerm, setSearchTerm] = useState('');
    const [open, setOpen] = useState(false);
    const [editMode, setEditMode] = useState(false);
    const [currentEmployee, setCurrentEmployee] = useState({
        id: null,
        name: '',
        position: '',
        imageBase64: ''
    });
    const [imagePreview, setImagePreview] = useState('');

    const fetchEmployees = async (page, searchTerm, size) => {
     
        try {
            const response = await axios.get('http://localhost:8080/api/employee/find', {
                params: {
                    searchWord: searchTerm,
                    page: page,
                    size: size
                }
            });

            const employees = response.data.data.map(emp => ({
                id: emp.id,
                name: emp.name,
                position: emp.position,
                image: emp.imageBase64 ? `${emp.imageBase64}` : '',
            }));

            setData(employees);
            setTotalCount(response.data.totalCount);
        } catch (error) {
            console.error('Error fetching employees:', error);
        }
    };

    useEffect(() => {
        fetchEmployees(page, searchTerm , size);
    }, [page, searchTerm, size]);

    const handleOpen = (employee) => {   
      
      
      if (employee) {
        
        setCurrentEmployee(employee);
        setImagePreview(employee.image || ''); 
    } else {
         
        setCurrentEmployee({ id: null, name: '', position: '', imageBase64: '' });
        setImagePreview('');  
    }

      setEditMode(!!employee); 
      setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
        setCurrentEmployee({ id: null, name: '', position: '', imageBase64: null });
        setImagePreview(''); // Reset image preview
    };

    const handleEdit = async () => {
        
      if (!currentEmployee.name) {
        toast.error('Name cannot be empty');
        return;
      }

      if (!currentEmployee.position) {
          toast.error('Position cannot be empty');
          return;
      }

      if (!currentEmployee.imageBase64) {
          toast.error('Image cannot be empty');
          return;
      }
      alert(currentEmployee.id);
      const data = {
        id: currentEmployee.id,
        name: currentEmployee.name,
        position: currentEmployee.position,
        imageBase64: currentEmployee.imageBase64
    };

        try {
            await axios.post(`http://localhost:8080/api/employee/update`, data);
            fetchEmployees(page, searchTerm, size);
            handleClose();
        } catch (error) {
            console.error('Error saving employee:', error);
        }
    };

    const handleSave = async () => {
        if (!currentEmployee.name) {
            toast.error('Name cannot be empty');
            return;
        }

        if (!currentEmployee.position) {
            toast.error('Position cannot be empty');
            return;
        }

        if (!currentEmployee.imageBase64) {
            toast.error('Image cannot be empty');
            return;
        }

        const data = {
            name: currentEmployee.name,
            position: currentEmployee.position,
            imageBase64: currentEmployee.imageBase64
        };

        saveNewEmployee(data);
    };

    const saveNewEmployee = async (data) => {
        try {
            await axios.post('http://localhost:8080/api/employee/add', data);
            fetchEmployees(page, searchTerm, size);
            handleClose();
            toast.success('Successfully added member');
        } catch (error) {
            console.error('Error saving employee:', error);
            toast.error(error.response.data);
        }
    };

    const handleDelete = async (id) => {
        try {
            await axios.delete(`http://localhost:8080/api/employee/delete/${id}`);
            fetchEmployees(page, searchTerm, size);
        } catch (error) {
            console.error('Error deleting employee:', error);
        }
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                const base64String = reader.result.split(',')[1];
                const base64WithPrefix = `data:image/png;base64,${base64String}`;
                document.getElementById("images64encode").value = base64WithPrefix;

                setImagePreview(reader.result);
                setCurrentEmployee({ ...currentEmployee, imageBase64: base64WithPrefix });
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSelectChange = (e) => {
        setCurrentEmployee({ ...currentEmployee, position: e.target.value });
    };

    const columns = [
        {
            name: "No",
            label: "",
            options: {
                customBodyRender: (value, tableMeta) => {
                    return tableMeta.rowIndex + 1 + page * 10;
                }
            }
        },
        { name: "name", label: "" },
        { name: "position", label: "" },
        {
            name: "image",
            label: "",
            options: {
                customBodyRender: (value) => (
                    <img src={value} alt="Employee" style={{ width: '100px', height: '100px', objectFit: 'cover' }} />
                )
            }
        },
        {
            name: "actions",
            label: "",
            options: {
              customBodyRender: (value, tableMeta) => ( 
                <div style={{ display: 'flex', justifyContent: 'space-around' }}>
                    <IconButton 
                        color="primary" 
                        onClick={() => handleOpen(data[tableMeta.rowIndex])}
                    >
                        <EditIcon />
                    </IconButton>
                    <IconButton 
                        color="secondary" 
                        onClick={() => handleDelete(data[tableMeta.rowIndex].id)}
                    >
                        <DeleteIcon />
                    </IconButton>
                </div>
              )
            }
        }
    ];

    const options = {
        serverSide: true,
        filterType: 'checkbox',
        pagination: true,
        page: page,
        count: totalCount,
        rowsPerPage: 10,
        download: false,
        print: false,
        filter: false,
        selectableRows: 'none',
        viewColumns: true, 
        onTableChange: (action, tableState) => {
            switch (action) {
                case 'changePage':
                    
                    setPage(tableState.page);
                    fetchEmployees(tableState.page, searchTerm, tableState.rowsPerPage);
                    break;
                case 'changeRowsPerPage':  
                  setsize(tableState.rowsPerPage);
                  fetchEmployees(tableState.page, searchTerm, tableState.rowsPerPage);
                  break;
                case 'search':
                    setSearchTerm(tableState.searchText);
                    break;
                default:
                    break;
            }
        }
    };

    return (
        <Container>
            <ToastContainer />
            <Button
                variant="contained"
                color="primary"
                onClick={() => handleOpen(null)}
                style={{ marginTop: '30px',marginBottom: '20px' }}
            >
                Add New Member
            </Button>
            <MUIDataTable
                title={"Member List"}
                data={data}
                columns={columns}
                options={options}
            />

            <Modal open={open} onClose={handleClose}>
                <Container maxWidth="xs">
                    <Paper style={{ padding: '20px' }}>
                        <h2>{editMode ? 'Edit Member' : 'Add Employee'}</h2>
                        <Grid container spacing={2}>
                            <Grid item xs={12}>
                                <TextField
                                    fullWidth
                                    label="Name"
                                    value={currentEmployee?.name || ''}
                                    onChange={(e) => setCurrentEmployee({ ...currentEmployee, name: e.target.value })}
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <FormControl fullWidth>
                                    <InputLabel>Position</InputLabel>
                                    <Select
                                        value={currentEmployee?.position || ''}
                                        onChange={handleSelectChange}
                                    >
                                        <MenuItem value="Owner">Owner</MenuItem>
                                        <MenuItem value="Staff">Staff</MenuItem>
                                        <MenuItem value="Manager">Manager</MenuItem>
                                        <MenuItem value="Kasir">Kasir</MenuItem>
                                        <MenuItem value="Driver">Driver</MenuItem>
                                        <MenuItem value="Security">Security</MenuItem>
                                    </Select>
                                </FormControl>
                            </Grid>
                            <Grid item xs={12}>
                                <Input
                                    type="file"
                                    accept=".jpg, .jpeg" // Restrict to JPEG files
                                    onChange={handleImageChange}
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <Input
                                    type="hidden"
                                    value={currentEmployee?.imageBase64 || ''}
                                    id="images64encode"
                                    readOnly
                                />
                            </Grid>

                            {imagePreview && (
                                <Grid item xs={12}>
                                    <img
                                        src={imagePreview}
                                        alt="Preview"
                                        style={{ width: '100%', height: 'auto', objectFit: 'cover' }}
                                    />
                                </Grid>
                            )}
                            <Grid item xs={6} style={{ textAlign: 'left' }}>
                                <Button onClick={handleClose} color="secondary" variant="contained">
                                    Cancel
                                </Button>
                            </Grid>
                            <Grid item xs={6} style={{ textAlign: 'right' }}>
                                <Button
                                    onClick={editMode ? handleEdit : handleSave}
                                    color="primary"
                                    variant="contained"
                                    style={{ marginLeft: '10px' }}
                                >
                                    {editMode ? 'Update' : 'Save'}
                                </Button>
                            </Grid>
                        </Grid>
                    </Paper>
                </Container>
            </Modal>
        </Container>
    );
};

export default Home;
