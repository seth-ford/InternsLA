USE [C84_InternsLA]
GO
/****** Object:  StoredProcedure [dbo].[UserProfile_Insert_Wizard]    Script Date: 3/30/2020 6:27:23 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
ALTER PROC [dbo].[UserProfile_Insert_Wizard] @Id         INT OUTPUT, 
                                             @UserId     INT, 
                                             @FirstName  NVARCHAR(100), 
                                             @LastName   NVARCHAR(100), 
                                             @Mi         NVARCHAR(2) = NULL, 
                                             @AvatarUrl  VARCHAR(255) = NULL, 
                                             @Skills AS     SKILLLISTTYPE READONLY, 
                                             @Files AS      FILETABLETYPE READONLY, 
                                             @Education AS  EDUCATIONTABLETYPE READONLY, 
                                             @Experience AS EXPERIENCETABLETYPE READONLY, 
                                             @Seeker AS     SEEKERTABLETYPE READONLY
AS

/*
DECLARE @UserId INT= 16, @FirstName NVARCHAR(100)= 'Seth', @LastName NVARCHAR(100)= 'Oscar', @Mi NVARCHAR(2)= 'P', @AvatarUrl VARCHAR(255)= 'https://images.pexels.com/photos/670720/pexels-photo-670720.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940', @Id INT= 0;
DECLARE @Skills AS SKILLLISTTYPE;
INSERT INTO @Skills
([SkillId], 
 [SkillLevelId]
)
VALUES
(25, 
 3
);
INSERT INTO @Skills
([SkillId], 
 [SkillLevelId]
)
VALUES
(22, 
 5
);
DECLARE @Files AS FILETABLETYPE;
INSERT INTO @Files
([CreatedBy], 
 [FileTypeId], 
 [URL]
)
VALUES
(1, 
 1, 
 'someUrl'
);
INSERT INTO @Files
([CreatedBy], 
 [FileTypeId], 
 [URL]
)
VALUES
(2, 
 1, 
 'someOtherUrl'
);
DECLARE @Education AS EDUCATIONTABLETYPE;
INSERT INTO @Education
([CertificateTypeId], 
 [EndDate], 
 [GPA], 
 [InstituteName], 
 [Major], 
 [Percentage], 
 [StartDate]
)
VALUES
(1, 
 GETUTCDATE(), 
 3.8, 
 'Harvard', 
 'Comp Sci', 
 NULL, 
 GETUTCDATE()
);
DECLARE @Experience AS EXPERIENCETABLETYPE;
INSERT INTO @Experience
([City], 
 [CompanyName], 
 [Country], 
 [Description], 
 [EndDate], 
 [isCurrent], 
 [JobTitle], 
 [StartDate], 
 [State]
)
VALUES
('The Ranch', 
 'McDonalds', 
 'United States', 
 'Fry Cooking Patties', 
 GETUTCDATE(), 
 1, 
 'Manager', 
 GETUTCDATE(), 
 'CA'
);
DECLARE @Seeker AS SEEKERTABLETYPE;
INSERT INTO @Seeker
([Currency], 
 [CurrentSalary], 
 [HasActiveEmailNotification], 
 [IsSearchable]
)
VALUES
('USD', 
 10000, 
 1, 
 0
);

EXECUTE [dbo].[UserProfile_Insert_Wizard] 
        @Id, 
        @UserId, 
        @FirstName, 
        @LastName, 
        @Mi, 
        @AvatarUrl, 
        @Skills, 
        @Files, 
        @Education, 
        @Experience, 
        @Seeker;
SELECT *
FROM dbo.UserProfiles
SELECT *
FROM dbo.Seekers
SELECT *
FROM dbo.Files
SELECT *
FROM dbo.SeekerFiles
SELECT *
FROM dbo.SeekerSkills
SELECT *
FROM dbo.EducationDetail
SELECT *
FROM dbo.ExperienceDetails

*/

     SET XACT_ABORT ON;
     DECLARE @Tran NVARCHAR(50)= '_uniquTxNameHere';
    BEGIN TRY
        BEGIN TRANSACTION @Tran;
        BEGIN
            EXECUTE [dbo].[UserProfiles_Insert] 
                    @UserId, 
                    @FirstName, 
                    @LastName, 
                    @Mi, 
                    @AvatarUrl, 
                    @Id OUTPUT;
            --Insert Into Files
            EXECUTE [dbo].[Files_Insert_V3] 
                    @Files;
            --Insert to Seeker Files
            EXECUTE [dbo].[SeekerFiles_Insert] 
                    @Files, 
                    @UserId;

            --Insert to Seeker Skills
            EXECUTE [dbo].[SeekerSkills_Insert] 
                    @Skills, 
                    @UserId;
            -- Insert to dbo.EducationDetail --
            EXECUTE [dbo].[EducationDetail_Insert_V2] 
                    @Education, 
                    @UserId;
            --Insert Into ExperienceDetails
            EXECUTE [dbo].[ExperienceDetails_Insert_V2] 
                    @Experience, 
                    @UserId;
            --Insert Into Seekers Profile
            EXECUTE [dbo].[Seekers_Insert_V3] 
                    @Seeker, 
                    @UserId;
        END;
        COMMIT TRANSACTION @Tran;
    END TRY
    BEGIN CATCH
        IF(XACT_STATE()) = -1
            BEGIN
                PRINT 'The transaction is in an uncommittable state.' + ' Rolling back transaction.';
                ROLLBACK TRANSACTION @Tran;
        END;

        -- Test whether the transaction is active and valid.  
        IF(XACT_STATE()) = 1
            BEGIN
                PRINT 'The transaction is committable.' + ' Committing transaction.';
                COMMIT TRANSACTION @Tran;
        END;

        -- If you want to see error info
        -- SELECT
        --ERROR_NUMBER() AS ErrorNumber,
        --ERROR_SEVERITY() AS ErrorSeverity,
        --ERROR_STATE() AS ErrorState,
        -- ERROR_PROCEDURE() AS ErrorProcedure,
        -- ERROR_LINE() AS ErrorLine,
        -- ERROR_MESSAGE() AS ErrorMessage
        -- to just get the error thrown and see the bad news as an exception
        THROW;
    END CATCH;
     SET XACT_ABORT OFF;