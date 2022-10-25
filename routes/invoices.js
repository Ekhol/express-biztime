const express = require("express");
const ExpressError = require("../expressError");
const db = require("../db");

let router = new express.Router();

router.get("/", async function (req, res, next) {
    try {
        const result = await db.query(
            `SELECT id, comp_code FROM invoices ORDER BY id`
        );

        return res.json({ "invoices": result.rows });
    }
    catch (err) {
        return next(err);
    }
});

router.get("/:id", async function (req, res, next) {
    try {
        let id = req.params.id;

        const result = await db.query(
            `SELECT i.id, i.amt, i.paid, i.add_date, i.paid_date,
            c.name, c.description
            FROM invoices AS i
            INNER JOIN companies AS c ON (i.comp_code = c.code)
            WHERE id=$1`,
            [id]
        );

        if (result.rows.length === 0) {
            throw new ExpressError(`Invoice not found: ${id}`, 404);
        }

        const data = result.rows[0];

        const invoice = {
            id: data.id,
            amt: data.amt,
            paid: data.paid,
            add_date: data.add_date,
            paid_date: data.paid_date,
            company: {
                code: data.comp_code,
                name: data.name,
                description: data.description,
            }
        };

        return res.json({ "invoice": invoice });
    }
    catch (err) {
        return next(err);
    }
});

router.post("/", async function (req, res, next) {
    try {
        let { comp_code, amount } = req.body;

        const result = db.query(
            `INSERT INTO invoices (comp_code, amt)
            VALUES ($1, $2)
            RETURNING id, comp_code, amt, paid, add_date, paid_date`,
            [comp_code, amt]
        );

        return res.json({ "invoice": result.rows[0] });
    }

    catch (err) {
        return next(err);
    }
});

router.put("/:id", async function (req, res, next) {
    try {
        let { amt } = req.body;
        let id = req.params.id;

        const result = await db.query(
            `UPDATE invoices
            SET amt=$1
            WHERE id=$2
            RETURNING id, comp_code, amt, paid, add_date, paid_date`,
            [id, comp_code, amt, paid, add_date, paid_date]
        );

        if (result.rows.length === 0) {
            throw new ExpressError(`Invoice not found: ${id}`, 404);
        } else {
            return res.json({ "invoice": result.rows[0] });
        }
    }
    catch (err) {
        return next(err);
    }
});

router.delete("/:id", async function (req, res, next) {
    try {
        let id = req.params.id;

        const result = await db.query(
            `DELETE FROM invoices
            WHERE id=$1
            RETURNING id`,
            [id]
        );
        if (result.rows.length === 0) {
            throw new ExpressError(`Invoice not found: ${id}`, 404);
        } else {
            return res.json({ "status": "deleted" });
        }
    } catch (err) {
        return next(err);
    }
});

module.exports = router;