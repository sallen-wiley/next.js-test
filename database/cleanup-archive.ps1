# Archive Legacy Database Migration Files
# This script moves old incremental migration files to the archive folder

Write-Host "=========================================" -ForegroundColor Cyan
Write-Host "Database Cleanup: Archiving Legacy Files" -ForegroundColor Cyan
Write-Host "=========================================" -ForegroundColor Cyan
Write-Host ""

$archivePath = "database\archive"
$legacyFiles = @(
    "add_manuscript_tags.sql",
    "add_manuscript_version.sql",
    "add_report_submitted_status.sql",
    "admin_role_implicit_access.sql",
    "allow_null_manuscript_tags.sql",
    "enable_write_operations.sql",
    "final_setup.sql",
    "fix_editor_id_nullable.sql",
    "invitation_queue_rls.sql",
    "remove_editor_id_from_manuscripts.sql",
    "reviewer_matches_rls.sql",
    "schema.sql",
    "seed_reviewer_matches.sql",
    "setup.sql",
    "update_manuscript_statuses.sql",
    "user_manuscripts_migration.sql"
)

$filesToDelete = @(
    "export_current_schema.sql"  # Replaced by 99_export_schema.sql
)

# Count files
$moveCount = 0
$deleteCount = 0
$skipCount = 0

# Move legacy files to archive
Write-Host "Moving legacy files to archive..." -ForegroundColor Yellow
foreach ($file in $legacyFiles) {
    $sourcePath = "database\$file"
    $destPath = "$archivePath\$file"
    
    if (Test-Path $sourcePath) {
        Move-Item -Path $sourcePath -Destination $destPath -Force
        Write-Host "  ✓ Moved: $file" -ForegroundColor Green
        $moveCount++
    } else {
        Write-Host "  ⊘ Skipped (not found): $file" -ForegroundColor Gray
        $skipCount++
    }
}

Write-Host ""

# Delete obsolete files
Write-Host "Removing obsolete files..." -ForegroundColor Yellow
foreach ($file in $filesToDelete) {
    $filePath = "database\$file"
    
    if (Test-Path $filePath) {
        Remove-Item -Path $filePath -Force
        Write-Host "  ✓ Deleted: $file" -ForegroundColor Green
        $deleteCount++
    } else {
        Write-Host "  ⊘ Skipped (not found): $file" -ForegroundColor Gray
        $skipCount++
    }
}

Write-Host ""
Write-Host "=========================================" -ForegroundColor Cyan
Write-Host "Cleanup Summary" -ForegroundColor Cyan
Write-Host "=========================================" -ForegroundColor Cyan
Write-Host "  Moved to archive: $moveCount files" -ForegroundColor Green
Write-Host "  Deleted: $deleteCount files" -ForegroundColor Green
Write-Host "  Skipped (not found): $skipCount files" -ForegroundColor Gray
Write-Host ""
Write-Host "Current database structure:" -ForegroundColor Yellow
Write-Host "  database/" -ForegroundColor White
Write-Host "    README.md                  (new)" -ForegroundColor Green
Write-Host "    00_cleanup.sql             (new)" -ForegroundColor Green
Write-Host "    01_core_tables.sql         (new)" -ForegroundColor Green
Write-Host "    02_rls_policies.sql        (new)" -ForegroundColor Green
Write-Host "    99_export_schema.sql       (new)" -ForegroundColor Green
Write-Host "    archive/                   ($moveCount legacy files)" -ForegroundColor Gray
Write-Host ""
Write-Host "Next steps:" -ForegroundColor Cyan
Write-Host "  1. Review DATABASE_CLEANUP_SUMMARY.md" -ForegroundColor White
Write-Host "  2. Test fresh database setup (optional)" -ForegroundColor White
Write-Host "  3. Create 03_seed_data.sql with sample data" -ForegroundColor White
Write-Host "  4. Update schema export using 99_export_schema.sql" -ForegroundColor White
Write-Host ""
Write-Host "Cleanup complete!" -ForegroundColor Green
