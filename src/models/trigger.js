import { db } from "../config/db.js";

const createGroupAdminTrigger = async () => {
  const triggerSQL = `
        CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
        
        CREATE OR REPLACE FUNCTION create_group_admin_function()
        RETURNS TRIGGER AS $$
        BEGIN
            INSERT INTO public.groupusers(id, is_admin, "createdAt", "updatedAt", user_id, group_id)
            VALUES (uuid_generate_v4(), true, NOW(), NOW(), NEW.created_by, NEW.id);
            RETURN NEW;
        END;
        $$ LANGUAGE plpgsql;

        CREATE OR REPLACE TRIGGER create_group_admin AFTER INSERT ON groups
        FOR EACH ROW
        EXECUTE FUNCTION create_group_admin_function();
    `;

  try {
    await db.query(triggerSQL);
    console.log("Trigger created successfully");
  } catch (error) {
    console.error("Failed to create trigger:", error);
  }
};

const deleteTaskParticipants = async () => {
  triggerSQL = `
  CREATE OR REPLACE FUNCTION delete_task_participants()
  RETURNS TRIGGER AS $$
  BEGIN
      DELETE FROM task_participants
      WHERE task_id = OLD.id;
      RETURN OLD;
  END;
  $$ LANGUAGE plpgsql;

  CREATE OR REPLACE TRIGGER delete_task_participants_trigger
  BEFORE DELETE ON tasks
  FOR EACH ROW
  EXECUTE FUNCTION delete_task_participants();
`;
};

export { createGroupAdminTrigger, deleteTaskParticipants };
