const db = require("./db");

async function testData() {
    await db.query("DELETE FROM invoices");
    await db.query("DELETE FROM companies");
    await db.query("SELECT setval('invoices_id_seq', 1, false)");

    await db.query(
        `INSERT INTO companies (code, name, description)
        VALUES ('apple', 'Apple Computer', 'Maker of OSX.'),
               ('ibm', 'IBM', 'Big blue.')`
    );

    const invoices = await db.query(
        `INSERT INTO invoices (comp_code, amt, paid, add_date, paid_date)
        VALUES ('apple', 100, false, '2018-01-02, null),
               ('apple', 200, false, '2018-01-03, null),
               ('apple', 300, true, '2018-01-01', '2018-02-01'),
               ('ibm', 400, false, '2018-01-01 null)
        RETURNING id`
    );
}

module.exports = { testData };