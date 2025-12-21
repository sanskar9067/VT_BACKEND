export const registerUser = async (req, res) => {
    try {
        //const { username, fullName, email, password } = req.body;
        //console.log(req);
        res.status(200).json({ message: "User registered successfully" });
    } catch (error) {
        console.error("Error registering user:", error);
        res.status(500).json({ message: "Internal server error" });
    }
}