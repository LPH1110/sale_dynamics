package com.pos.sale_dynamics.generators;

import org.hibernate.HibernateException;
import org.hibernate.engine.spi.SharedSessionContractImplementor;
import org.hibernate.id.IdentifierGenerator;
import org.hibernate.jdbc.ReturningWork;

import java.io.Serializable;
import java.sql.Connection;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Statement;

public class OrderIdGenerator implements IdentifierGenerator {

    @Override
    public Serializable generate(SharedSessionContractImplementor session, Object object) throws HibernateException {
        String prefix = "SD";
        Connection connection = session.doReturningWork(
                new ReturningWork<Connection>() {
                    @Override
                    public Connection execute(Connection conn) throws SQLException {
                        return conn;
                    }
                }
        );

        try (Statement statement = connection.createStatement()) {
            ResultSet rs = statement.executeQuery("SELECT COUNT(order_id) FROM orders");

            if (rs.next()) {
                int id = rs.getInt(1) + 1;
                return prefix + String.format("%04d", id);
            }
        } catch (Exception e) {
            // handle exception
            throw new HibernateException(e.getMessage());
        }

        return null;
    }
}
