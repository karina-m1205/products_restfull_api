const express = require("express");
const app = express();

const body_parser = require("body-parser");
app.use(body_parser.json());

const fs = require("fs");

// task 2.1 CRUD Operations for Products:
app.get("/products", (req, res) => {
    try {
        const all_products = fs.readFileSync("products.json");
        const products = JSON.parse(all_products);
        res.send(products);
    } catch (err) {
        return res.status(500).send("Something went wrong...");
    }
});

app.get('/products/:id', (req, res) => {
    try {
        const all_products = fs.readFileSync("products.json");
        const products = JSON.parse(all_products);
        const product = products.find(product => products.indexOf(product) === parseInt(req.params.id));
        if (product) {
            res.send(product);
        } else {
            return res.status(404).send("product not found");
        }
    } catch (err) {
        return res.status(500).send("Something went wrong...");
    }
});

app.post("/products", (req, res) => {
    if (!req.body.name || !req.body.description || !req.body.price) {
        return res.status(400).send("doesn't exist");
    }

    let single_product_data = {
        name: req.body.name,
        description: req.body.description,
        price: req.body.price
    };

    try {
        const all_products = fs.readFileSync("products.json");
        const products = JSON.parse(all_products);

        if (!products.find(product => product.name === single_product_data.name)) {
            products.push(single_product_data);
        } else {
            return res.status(400).send("product already exists"); // поискать статус-код для этого случая
        }

        fs.writeFileSync("products.json", JSON.stringify(products));
        res.send(single_product_data);
    } catch (err) {
        return res.status(500).send("Something went wrong...");
    }
});

app.put("/products/:id", (req, res) => {
    try {
        const all_products = fs.readFileSync("products.json");
        const products = JSON.parse(all_products);
        const product = products.find(product => products.indexOf(product) === parseInt(req.params.id));

        if (product) {
            const { name, description, price } = { ...req.body };
            product.name = name;
            product.description = description;
            product.price = price;

            fs.writeFileSync("products.json", JSON.stringify(products));
            res.send(product);
        } else {
            return res.status(404).send("product not found");
        }
    } catch (err) {
        return res.status(500).send("Something went wrong...");
    }
});

app.delete("/products/:id", (req, res) => {
    try {
        const all_products = fs.readFileSync("products.json");
        let products = JSON.parse(all_products);
        let product = products.find(product => products.indexOf(product) === parseInt(req.params.id));

        if (product) {
            products.splice(products.indexOf(product), 1);
            fs.writeFileSync("products.json", JSON.stringify(products));
            res.send("product has been deleted");
        } else {
            return res.status(404).send("product not found");
        }
    } catch (err) {
        return res.status(500).send("Something went wrong");
    }
});

// task 2.2 CRUD Operations for Orders:
app.get("/orders", (req, res) => {
    try {
        const all_orders = fs.readFileSync("orders.json");
        const orders = JSON.parse(all_orders);
        res.send(orders);
    } catch (err) {
        return res.status(500).send("Something went wrong...");
    }
});

app.get('/orders/:id', (req, res) => {
    try {
        const all_orders = fs.readFileSync("orders.json");
        const orders = JSON.parse(all_orders);
        const order = orders.find(order => orders.indexOf(order) === parseInt(req.params.id));
        if (order) {
            res.send(order);
        } else {
            return res.status(404).send("order not found");
        }
    } catch (err) {
        return res.status(500).send("Something went wrong...");
    }
});

app.post("/orders", (req, res) => {
    if (!req.body.order_number || !req.body.buyer_name || !req.body.buyer_address) {
        return res.status(400).send("doesn't exist");
    }

    let single_order_data = {
        order_number: req.body.order_number,
        buyer_name: req.body.buyer_name,
        buyer_address: req.body.buyer_address,
        order_status: "pending"
    };

    try {
        const all_orders = fs.readFileSync("orders.json");
        const orders = JSON.parse(all_orders);

        if (!orders.find(order => order.order_number === parseInt(single_order_data.order_number))) {
            orders.push(single_order_data);
        } else {
            return res.status(400).send("order already exists"); // поискать статус-код для этого случая
        }

        fs.writeFileSync("orders.json", JSON.stringify(orders));
        res.send(single_order_data);
    } catch (err) {
        return res.status(500).send("Something went wrong...");
    }
});

app.put("/orders/:id", (req, res) => {
    try {
        const all_orders = fs.readFileSync("orders.json");
        const orders = JSON.parse(all_orders);
        const order = orders.find(order => orders.indexOf(order) === parseInt(req.params.id));

        if (order) {
            const { order_number, buyer_name, buyer_address } = { ...req.body };
            order.order_number = order_number;
            order.buyer_name = buyer_name;
            order.buyer_address = buyer_address;

            fs.writeFileSync("orders.json", JSON.stringify(orders));
            res.send(order);
        } else {
            return res.status(404).send("order not found");
        }
    } catch (err) {
        return res.status(500).send("Something went wrong...");
    }
});

app.delete("/orders/:id", (req, res) => {
    try {
        const all_orders = fs.readFileSync("orders.json");
        let orders = JSON.parse(all_orders);
        let order = orders.find(order => orders.indexOf(order) === parseInt(req.params.id));

        if (order) {
            orders.splice(orders.indexOf(order), 1);
            fs.writeFileSync("orders.json", JSON.stringify(orders));
            res.send("order has been deleted");
        } else {
            return res.status(404).send("order not found");
        }
    } catch (err) {
        return res.status(500).send("Something went wrong");
    }
});
//
// task 2.3 Order Items
app.get("/orders/:id/items", (req, res) => {
    try {
        const all_orders = fs.readFileSync("orders.json");
        const orders = JSON.parse(all_orders);
        const order = orders.find(order => orders.indexOf(order) === parseInt(req.params.id));
        if (order) {
            if ("items" in order) {
                res.send(order.items);
            } else {
                return res.send("order's items not found")
            }
        } else {
            return res.status(404).send("order not found");
        }
    } catch (err) {
        return res.status(500).send("Something went wrong...");
    }
});

app.post("/orders/:id/items", (req, res) => {
    if (!req.body) {
        return res.status(400).send("doesn't exist");
    }

    let items = {};
    for (key in req.body) {
        items[key] = req.body[key];
    }

    try {
        const all_orders = fs.readFileSync("orders.json");
        const orders = JSON.parse(all_orders);
        const order = orders.find(order => orders.indexOf(order) === parseInt(req.params.id));

        const all_products = fs.readFileSync("products.json");
        const products = JSON.parse(all_products);

        if (order) {
            order.items = {};
            for (key in items) {
                let item = products.find(product => product.name === items[key]);
                if (item) {
                    order.items[key] = items[key];
                } else {
                    return res.send("item not found in products list");
                }
            }
            fs.writeFileSync("orders.json", JSON.stringify(orders));
            res.send(items);
        } else {
            return res.status(400).send("order not found");
        }
    } catch (err) {
        return res.status(500).send("Something went wrong...");
    }
});
//
// task 2.4 Order Status Tracking:
app.put("/orders/:id/status", (req, res) => {
    try {
        const all_orders = fs.readFileSync("orders.json");
        const orders = JSON.parse(all_orders);
        const order = orders.find(order => orders.indexOf(order) === parseInt(req.params.id));

        if (!order) {
            return res.status(404).send("order not found");
        }

        const receivedStatus = req.body.status;
        const currentStatus = order.status;

        if ((currentStatus == "pending" && receivedStatus != "shipped")
            ||
            currentStatus == "shipped" && receivedStatus != "delivered") {
            return res.status(500).send("Unable to change status from " + currentStatus + " to " + receivedStatus);
        }
        order.status = receivedStatus;
        fs.writeFileSync("orders.json", JSON.stringify(orders));
        res.send(order.status);
    } catch (err) {
        return res.status(500).send("Something went wrong...");
    }
});

app.get("/users/:userId/orders", (req, res) => {
    try {
        const all_users = fs.readFileSync("users.json");
        const users = JSON.parse(all_users);
        const all_orders = fs.readFileSync("orders.json");
        const orders = JSON.parse(all_orders);

        const user = users.find(user => users.indexOf(user) === parseInt(req.params.userId));
        if (!user) {
            return res.status(404).send("user not found");
        }

        const user_orders = orders.filter(order => order.buyer_name === user.name);
        if (!user_orders) {
            return res.status(500).send("the user has no orders");
        }

        res.send(user_orders);
    } catch (err) {
        return res.status(500).send("Something went wrong...");
    }
});

app.listen(3000);